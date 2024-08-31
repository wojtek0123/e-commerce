import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateOrderDetailDto } from './dto/create-order-detail.dto';
import { PrismaService } from '../prisma/prisma.service';
import { decode } from 'jsonwebtoken';
import { Book, ProductInventory } from '@prisma/client';
import { ProductInventoryEntity } from '../product-inventories/entities/product-inventory.entity';
import { BookEntity } from '../books/entities/book.entity';

@Injectable()
export class OrderDetailsService {
  constructor(private readonly prisma: PrismaService) {}

  // async create(
  //   { userAddressId, shippingMethodId }: CreateOrderDetailDto,
  //   authHeader: string,
  // ) {
  //   const userId = +decode(authHeader.split(' ')[1]).sub;
  //
  //   const shoppingSession = await this.prisma.shoppingSession.findUnique({
  //     where: { userId },
  //     include: {
  //       cartItems: true,
  //     },
  //   });
  //
  //   // TODO: reduce number of available books in inventory
  //
  //   // this.prisma.productInventory.updateMany({
  //   //   where: shoppingSession.cartItems.map(({bookId}) => bookId),
  //   // })
  //   const productInventories = [];
  //   shoppingSession.cartItems.map(async (cartItem) => {
  //     productInventories.push(
  //       await this.prisma.productInventory.findFirst({
  //         where: { book: { id: cartItem.bookId } },
  //         select: { id: true, quantity: true, book: true },
  //       }),
  //     );
  //   });
  //
  //   productInventories.map(async (pi) => {
  //     console.log(pi);
  //     await this.prisma.productInventory.update({
  //       where: { id: pi.id },
  //       data: {
  //         quantity:
  //           pi.quantity -
  //           shoppingSession.cartItems.find((ci) => ci.bookId === pi.book.id)
  //             .quantity,
  //       },
  //     });
  //   });
  //
  //   return this.prisma.orderDetails.create({
  //     data: {
  //       userAddress: {
  //         connect: { id: userAddressId },
  //       },
  //       shippingMethod: {
  //         connect: { id: shippingMethodId },
  //       },
  //       user: {
  //         connect: {
  //           id: userId,
  //         },
  //       },
  //       total: shoppingSession.total,
  //       paymentDetails: {
  //         create: {
  //           status: 'PROCESSING',
  //           provider: 'debit-card',
  //           amount: shoppingSession.total,
  //         },
  //       },
  //       orderItems: {
  //         createMany: {
  //           data: shoppingSession.cartItems.map(({ bookId, quantity }) => ({
  //             bookId,
  //             quantity,
  //           })),
  //         },
  //       },
  //     },
  //   });
  // }
  async create(
    { userAddressId, shippingMethodId }: CreateOrderDetailDto,
    authHeader: string,
  ) {
    // Decode and get the userId from the auth token
    let userId: number;
    try {
      userId = +decode(authHeader.split(' ')[1]).sub;
    } catch (error) {
      throw new UnauthorizedException('Invalid authentication token');
    }

    // Retrieve the shopping session and related cart items
    const shoppingSession = await this.prisma.shoppingSession.findUnique({
      where: { userId },
      include: { cartItems: true },
    });

    if (!shoppingSession) {
      throw new Error('No active shopping session found for the user');
    }

    // Retrieve all related product inventories
    const productInventories = await Promise.all(
      shoppingSession.cartItems.map((cartItem) =>
        this.prisma.productInventory.findFirst({
          where: { book: { id: cartItem.bookId } },
          select: { id: true, quantity: true, book: { select: { id: true } } },
        }),
      ),
    );

    // Update the inventory quantities
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

        console.log('HALO', newQuantity);

        return this.prisma.productInventory.update({
          where: { id: pi.id },
          data: { quantity: newQuantity },
        });
      }),
    );

    // Create the order with related entities
    return this.prisma.orderDetails.create({
      data: {
        userAddress: {
          connect: { id: userAddressId },
        },
        shippingMethod: {
          connect: { id: shippingMethodId },
        },
        user: {
          connect: { id: userId },
        },
        total: shoppingSession.total,
        paymentDetails: {
          create: {
            status: 'PROCESSING',
            provider: 'debit-card', // Customize as needed
            amount: shoppingSession.total,
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
    const userId = +decode(authHeader.split(' ')[1]).sub;
    return this.prisma.orderDetails.findMany({
      where: { userId },
      include: {
        orderItems: {
          include: {
            book: true,
          },
        },
        userAddress: {
          include: {
            country: true,
          },
        },
        paymentDetails: true,
        shippingMethod: true,
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
