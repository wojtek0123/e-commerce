import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateOrderDetailDto } from './dto/create-order-detail.dto';
import { PrismaService } from '../prisma/prisma.service';
import { decode } from 'jsonwebtoken';
import { OrderDetail } from './entities/order-detail.entity';
import { MailerService } from '@nestjs-modules/mailer';
import { BookEntity } from '../books/entities/book.entity';
import { OrderStatus, Role } from '@prisma/client';
import { EventsGateway } from '../app/gateways/events.gateway';

@Injectable()
export class OrderDetailsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mailerService: MailerService,
    private readonly socket: EventsGateway,
  ) {}

  async create(
    { shippingMethodId, paymentMethod, orderAddress }: CreateOrderDetailDto,
    authHeader: string,
  ) {
    let userId: string;
    try {
      userId = String(decode(authHeader.split(' ')[1]).sub);
    } catch (error: unknown) {
      throw new UnauthorizedException('Invalid authentication token');
    }

    const shoppingSession = await this.prisma.shoppingSession.findUnique({
      where: { userId },
      include: { cartItems: true, user: true },
    });

    if (!shoppingSession) {
      throw new NotFoundException(
        'No active shopping session found for the user',
      );
    }

    const productInventories = await Promise.all(
      shoppingSession.cartItems.map((cartItem) =>
        this.prisma.productInventory.findFirst({
          where: { book: { id: cartItem.bookId } },
          select: {
            id: true,
            quantity: true,
            book: { select: { id: true, title: true } },
          },
        }),
      ),
    );

    await Promise.all(
      productInventories.map((pi) => {
        const cartItem = shoppingSession.cartItems.find(
          (ci) => ci.bookId === pi.book.id,
        );

        const newQuantity = pi.quantity - cartItem.quantity;

        if (newQuantity < 0) {
          throw new ConflictException(
            `Not enough stock for book: ${pi.book.title}`,
          );
        }

        return this.prisma.productInventory.update({
          where: { id: pi.id },
          data: { quantity: newQuantity },
        });
      }),
    );

    const shippingMethod = await this.prisma.shippingMethod.findUnique({
      where: { id: shippingMethodId },
    });

    const total = shoppingSession.total + shippingMethod.price;

    const {
      firstName,
      lastName,
      postcode,
      phone,
      city,
      countryId,
      homeNumber,
      houseNumber,
      street,
    } = orderAddress;

    const order = await this.prisma.orderDetails.create({
      data: {
        shippingMethod: {
          connect: { id: shippingMethodId },
        },
        orderAddress: {
          create: {
            firstName,
            lastName,
            phone,
            city,
            postcode,
            street,
            houseNumber,
            homeNumber,
            country: {
              connect: {
                id: countryId,
              },
            },
          },
        },
        user: {
          connect: { id: userId },
        },
        total,
        paymentDetails: {
          create: {
            status: 'SUCCEEDED',
            method: paymentMethod,
            amount: total,
          },
        },
        orderItems: {
          createMany: {
            data: shoppingSession.cartItems.map(({ bookId, quantity }) => ({
              bookId,
              quantity,
            })),
          },
        },
      },
      include: {
        orderItems: {
          include: {
            book: { include: { authors: { include: { author: true } } } },
          },
        },
        orderAddress: { include: { country: true } },
        paymentDetails: true,
      },
    });

    try {
      await this.mailerService.sendMail({
        from: 'client-web@e-commerce.com',
        to: shoppingSession.user.email,
        subject: `Order no. ${order.id}`,
        template: './order-confirmation',
        context: {
          orderId: order.id,
          customer: {
            email: shoppingSession.user.email,
          },
          items: order.orderItems,
          orderDetails: {
            firstName: order.orderAddress.firstName,
            lastName: order.orderAddress.lastName,
            address: `${order.orderAddress.street} ${order.orderAddress.homeNumber}${order.orderAddress.houseNumber ? '/' + order.orderAddress.houseNumber : ''}, ${order.orderAddress.postcode} ${order.orderAddress.city}, ${order.orderAddress.country.name}`,
            phone: order.orderAddress.phone,
            paymentMethod: order.paymentDetails.method
              .replaceAll('_', ' ')
              .toLowerCase(),
            paymentStatus: order.paymentDetails.status,
          },
          total: order.total,
          shippingCost: shippingMethod.price,
          bookCost: order.orderItems.reduce(
            (acc, cur) => acc + cur.book.price,
            0,
          ),
        },
      });
    } catch (error: unknown) {
      console.log(error);
    }

    try {
      await this.prisma.shoppingSession.delete({ where: { userId } });
    } catch (error: unknown) {
      throw new InternalServerErrorException(
        'Failed to process order. Please try again.',
      );
    }

    try {
      await this.prisma.shoppingSession.create({ data: { userId, total: 0 } });
    } catch (error: unknown) {
      throw new InternalServerErrorException(
        'Failed to initialize new shopping session.',
      );
    }

    this.socket.server.emit('order', order);

    return order;
  }

  findAll(
    authHeader: string,
    filters: {
      startDate?: string;
      endDate?: string;
      sortBy?: string;
      sortByMode?: string;
      status?: string;
    },
  ) {
    const role = decode(authHeader.split(' ')[1])['role'] as Role | undefined;
    const userId = authHeader
      ? String(decode(authHeader.split(' ')[1]).sub)
      : null;

    const parsedSortByMode = ['asc', 'desc'].includes(filters.sortByMode)
      ? filters.sortByMode
      : 'asc';

    const parsedSortBy = ['createdAt', 'status'].includes(filters.sortBy)
      ? filters.sortBy
      : 'createdAt';

    const parsedStatus = filters.status
      ?.split(',')
      ?.filter((status) =>
        (
          [
            OrderStatus.NEW,
            OrderStatus.SHIPPED,
            OrderStatus.PREPARED_FOR_SHIPPING,
            OrderStatus.PACKING,
          ] as string[]
        ).includes(status),
      ) as OrderStatus[] | undefined;

    // Create date filter condition if dates are provided
    const dateFilter =
      filters.startDate || filters.endDate
        ? {
            createdAt: {
              ...(filters.startDate && { gte: new Date(filters.startDate) }),
              ...(filters.endDate && { lte: new Date(filters.endDate) }),
            },
          }
        : {};

    return this.prisma.orderDetails.findMany({
      where: {
        ...dateFilter,
        ...(userId && role !== Role.ADMIN && { userId }),
        status: { in: parsedStatus },
      },
      orderBy: { [parsedSortBy]: parsedSortByMode },
    });
  }

  async findOne(authHeader: string, id: OrderDetail['id']) {
    const userId = String(decode(authHeader.split(' ')[1]).sub);
    const role = decode(authHeader.split(' ')[1])['role'] as Role | undefined;

    const order = await this.prisma.orderDetails.findUnique({
      where: {
        id,
        ...(userId && role !== Role.ADMIN && { userId }),
      },
      include: {
        orderAddress: {
          include: {
            country: true,
          },
        },
        shippingMethod: true,
        paymentDetails: true,
        orderItems: {
          include: {
            book: {
              include: {
                authors: {
                  include: {
                    author: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    return {
      ...order,
      orderItems: order.orderItems.map((item) => ({
        ...item,
        book: {
          ...item.book,
          authors: item.book.authors.map((a) => a.author),
        },
      })),
    };

    // return { ...order,  ...book, authors: book.authors.map((a) => a.author) };
  }

  async findOrder(authHeader: string, bookId: BookEntity['id']) {
    const userId = String(decode(authHeader.split(' ')[1]).sub);

    if (!userId) {
      throw new UnauthorizedException('You have to log in');
    }

    const order = await this.prisma.orderDetails.findFirst({
      where: { AND: { userId, orderItems: { some: { bookId } } } },
    });

    if (!order) {
      throw new NotFoundException('Not found order details');
    }

    return order;
  }

  async findAllOrders() {
    const orders = await this.prisma.orderDetails.findMany();

    return orders;
  }

  async update(id: string, body: { status: OrderStatus }) {
    return this.prisma.orderDetails.update({
      where: { id },
      data: { status: body.status },
    });
  }
}
