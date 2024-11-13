import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateOrderDetailDto } from './dto/create-order-detail.dto';
import { PrismaService } from '../prisma/prisma.service';
import { decode } from 'jsonwebtoken';
import { OrderDetail } from './entities/order-detail.entity';

@Injectable()
export class OrderDetailsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    { shippingMethodId, paymentMethod, orderAddress }: CreateOrderDetailDto,
    authHeader: string,
  ) {
    let userId: string;
    try {
      userId = String(decode(authHeader.split(' ')[1]).sub);
    } catch (error) {
      throw new UnauthorizedException('Invalid authentication token');
    }

    const shoppingSession = await this.prisma.shoppingSession.findUnique({
      where: { userId },
      include: { cartItems: true },
    });

    if (!shoppingSession) {
      throw new Error('No active shopping session found for the user');
    }

    const productInventories = await Promise.all(
      shoppingSession.cartItems.map((cartItem) =>
        this.prisma.productInventory.findFirst({
          where: { book: { id: cartItem.bookId } },
          select: { id: true, quantity: true, book: { select: { id: true } } },
        }),
      ),
    );

    await Promise.all(
      productInventories.map((pi) => {
        const cartItem = shoppingSession.cartItems.find(
          (ci) => ci.bookId === pi.book.id,
        );
        if (!cartItem) return;

        const newQuantity = pi.quantity - cartItem.quantity;

        if (newQuantity < 0) {
          throw new Error(`Not enough stock for bookId: ${pi.book.id}`);
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

    return this.prisma.orderDetails.create({
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
    });
  }

  findAll(authHeader: string) {
    const userId = String(decode(authHeader.split(' ')[1]).sub);

    return this.prisma.orderDetails.findMany({
      where: { userId },
    });
  }

  findOne(authHeader: string, id: OrderDetail['id']) {
    const userId = String(decode(authHeader.split(' ')[1]).sub);

    return this.prisma.orderDetails.findUnique({
      where: { id, userId },
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
            book: true,
          },
        },
      },
    });
  }
}
