import { Injectable } from '@nestjs/common';
import { CreateCartItemDto } from './dto/create-cart-item.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
import { PrismaService } from '../prisma/prisma.service';
import { decode } from 'jsonwebtoken';
import { ShoppingSessionsService } from '../shopping-sessions/shopping-sessions.service';

@Injectable()
export class CartItemsService {
  constructor(
    private prisma: PrismaService,
    private shoppingSessionService: ShoppingSessionsService
  ) {}

  async create({ bookId, userId, quantity }: CreateCartItemDto) {
    let shoppingSession = await this.prisma.shoppingSession.findUnique({
      where: { userId },
    });

    if (!shoppingSession) {
      shoppingSession = await this.prisma.shoppingSession.create({
        data: { userId, total: 0 },
      });
    }

    const existingCartItem = await this.prisma.cartItem.findFirst({
      where: { shoppingSessionId: shoppingSession.id, bookId },
    });

    if (existingCartItem) {
      return this.prisma.cartItem.update({
        where: { id: existingCartItem.id },
        data: { quantity: existingCartItem.quantity + quantity },
      });
    }

    const cartItem = await this.prisma.cartItem.create({
      data: { bookId, shoppingSessionId: shoppingSession.id, quantity },
    });

    this.shoppingSessionService.updateTotal(shoppingSession.id);

    return cartItem;
  }

  findAll() {
    return this.prisma.cartItem.findMany();
  }

  findOne(id: number) {
    return this.prisma.cartItem.findUnique({ where: { id } });
  }

  async getUserCartItemsTotal(authHeader: string) {
    // const decodedAccessToken = decode(authHeader.split(' ')[1]);
    //
    // const cartItems = await this.prisma.cartItem.findMany({
    //   where: { userId: +decodedAccessToken.sub },
    // });
    //
    // return cartItems.length;
  }

  async findUserCartItems(authHeader: string) {
    // const decodedAccessToken = decode(authHeader.split(' ')[1]);
    //
    // const cartItems = await this.prisma.cartItem.findMany({
    //   where: { userId: +decodedAccessToken.sub },
    //   include: {
    //     book: {
    //       include: { authors: { include: { author: true } } },
    //     },
    //   },
    // });
    //
    // return cartItems.map((item) => ({
    //   ...item,
    //   book: { ...item.book, authors: item.book.authors.map((a) => a.author) },
    // }));
  }

  async update(id: number, data: UpdateCartItemDto) {
    const cartItem = await this.prisma.cartItem.update({ where: { id }, data });

    this.shoppingSessionService.updateTotal(cartItem.shoppingSessionId);

    return cartItem;
  }

  remove(id: number) {
    return this.prisma.cartItem.delete({ where: { id } });
  }
}
