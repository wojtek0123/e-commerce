import { Injectable } from '@nestjs/common';
import { CreateOrderDetailDto } from './dto/create-order-detail.dto';
import { PrismaService } from '../prisma/prisma.service';
import { decode } from 'jsonwebtoken';

@Injectable()
export class OrderDetailsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    { userAddressId, shippingMethodId }: CreateOrderDetailDto,
    authHeader: string,
  ) {
    const userId = +decode(authHeader.split(' ')[1]).sub;

    const shoppingSession = await this.prisma.shoppingSession.findUnique({
      where: { userId },
      include: {
        cartItems: true,
      },
    });

    return this.prisma.orderDetails.create({
      data: {
        userAddress: {
          connect: { id: userAddressId },
        },
        shippingMethod: {
          connect: { id: shippingMethodId },
        },
        user: {
          connect: {
            id: userId,
          },
        },
        total: shoppingSession.total,
        paymentDetails: {
          create: {
            status: 'PROCESSING',
            provider: 'debit-card',
            amount: shoppingSession.total,
          },
        },
        orderItems: {
          createMany: {
            data: shoppingSession.cartItems.map(({ id, bookId, quantity }) => ({
              id,
              bookId,
              quantity,
            })),
          },
        },
      },
    });
  }

  findAll(authHeader: string) {
    const userId = +decode(authHeader.split(' ')[1]).sub;
    return this.prisma.orderDetails.findMany({
      where: { userId },
      include: {
        orderItems: {
          include: {
            book: true,
          },
        },
      },
    });
  }

  findOne(authHeader: string, id: number) {
    const userId = +decode(authHeader.split(' ')[1]).sub;

    return this.prisma.orderDetails.findUnique({
      where: { id, userId },
      include: {
        userAddress: {
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
