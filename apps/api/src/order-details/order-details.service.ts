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
import { Book } from '../books/entities/book.entity';
import { OrderStatus, Role } from '@prisma/client';
import { EventsGateway } from '../app/gateways/events.gateway';
import { parseNumber } from '../common/utils/parse-number';
import { Prisma } from '@prisma/client';
import { getUserIdFromAccessToken } from '../common/utils/get-user-id-from-access-token';

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
      // userId = String(decode(authHeader.split(' ')[1]).sub);
      userId = getUserIdFromAccessToken(authHeader);
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

    const inventories = await Promise.all(
      shoppingSession.cartItems.map((cartItem) =>
        this.prisma.inventory.findFirst({
          where: { bookId: cartItem.bookId },
          select: {
            id: true,
            quantity: true,
            book: { select: { id: true, title: true } },
          },
        }),
      ),
    );

    await Promise.all(
      inventories.map((inventory) => {
        const cartItem = shoppingSession.cartItems.find(
          (cartItem) => cartItem.bookId === inventory.book.id,
        );

        const newQuantity = inventory.quantity - cartItem.quantity;

        if (newQuantity < 0) {
          throw new ConflictException(
            `Not enough stock for book: ${inventory.book.title}`,
          );
        }

        return this.prisma.inventory.update({
          where: { id: inventory.id },
          data: { quantity: newQuantity },
        });
      }),
    );

    const shippingMethod = await this.prisma.shippingMethod.findUnique({
      where: { id: shippingMethodId },
    });

    const userInformation = await this.prisma.userInformation.findUnique({
      where: { userId },
    });

    const { firstName, lastName, phone } = userInformation;
    const { postcode, city, countryId, homeNumber, houseNumber, street } =
      orderAddress;

    const total = shoppingSession.total + shippingMethod.price;

    const order = await this.prisma.orderDetails.create({
      data: {
        orderShippingMethod: {
          create: {
            name: shippingMethod.name,
            price: shippingMethod.price,
          },
        },
        orderUserInformation: {
          create: {
            firstName,
            lastName,
            phone,
          },
        },
        orderAddress: {
          create: {
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
        orderUserInformation: true,
        paymentDetails: true,
      },
    });

    try {
      await this.mailerService.sendMail({
        from: 'storystash@e-commerce.com',
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
            firstName: order.orderUserInformation.firstName,
            lastName: order.orderUserInformation.lastName,
            address: `${order.orderAddress.street} ${order.orderAddress.homeNumber}${order.orderAddress.houseNumber ? '/' + order.orderAddress.houseNumber : ''}, ${order.orderAddress.postcode} ${order.orderAddress.city}, ${order.orderAddress.country.name}`,
            phone: order.orderUserInformation.phone,
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

  async findAll(
    authHeader: string,
    filters: {
      startDate?: string;
      endDate?: string;
      sortBy?: string;
      sortByMode?: string;
      status?: string;
      size?: string;
      page?: string;
    },
  ) {
    const role = decode(authHeader.split(' ')[1])['role'] as Role | undefined;
    const userId = authHeader
      ? String(decode(authHeader.split(' ')[1]).sub)
      : null;

    const pageNumber = parseNumber(filters.page);
    const sizeNumber = parseNumber(filters.size);

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

    const where: Prisma.OrderDetailsWhereInput = {
      AND: [
        {
          ...dateFilter,
          ...(userId && role !== Role.ADMIN && { userId }),
          status: { in: parsedStatus },
        },
      ],
    };

    const [orders, total] = await Promise.all([
      this.prisma.orderDetails.findMany({
        where: {
          ...dateFilter,
          ...(userId && role !== Role.ADMIN && { userId }),
          status: { in: parsedStatus },
        },
        orderBy: { [parsedSortBy]: parsedSortByMode },
        ...(pageNumber &&
          sizeNumber && { skip: (pageNumber - 1) * sizeNumber }),
        ...(sizeNumber && { take: sizeNumber }),
      }),

      this.prisma.orderDetails.count({ where }),
    ]);

    return {
      items: orders,
      total,
      count: orders.length,
      page: pageNumber,
    };
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
        orderUserInformation: true,
        orderShippingMethod: true,
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

  async findOrder(authHeader: string, bookId: Book['id']) {
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
