import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCartItemDto } from './dto/create-cart-item.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
import { PrismaService } from '../prisma/prisma.service';
import { decode } from 'jsonwebtoken';
// import {} from '@nestjs/common'

@Injectable()
export class CartItemsService {
  constructor(private prisma: PrismaService) {}

  async create({ bookId, userId, quantity }: CreateCartItemDto) {
    const existingCartItem = await this.prisma.cartItem.findFirst({
      where: { userId, bookId },
    });

    if (existingCartItem) {
      return this.prisma.cartItem.update({
        where: { id: existingCartItem.id },
        data: { quantity: existingCartItem.quantity + quantity },
      });
    }

    return this.prisma.cartItem.create({ data: { bookId, userId, quantity } });
  }

  findAll() {
    return this.prisma.cartItem.findMany();
  }

  findOne(id: number) {
    return this.prisma.cartItem.findUnique({ where: { id } });
  }

  async findUserCartItems(authHeader: string) {
    const decodedAccessToken = decode(authHeader.split(' ')[1]);

    const cartItems = await this.prisma.cartItem.findMany({
      where: { userId: +decodedAccessToken.sub },
      include: {
        book: {
          include: { authors: { include: { author: true } } },
        },
      },
    });

    return cartItems.map((item) => ({
      ...item,
      book: { ...item.book, authors: item.book.authors.map((a) => a.author) },
    }));
  }

  update(id: number, data: UpdateCartItemDto) {
    return this.prisma.cartItem.update({ where: { id }, data });
  }

  remove(id: number) {
    // throw new NotFoundException('not found this book');
    return this.prisma.cartItem.delete({ where: { id } });
  }
}
