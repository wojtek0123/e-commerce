import { Injectable } from '@nestjs/common';
import { CreateCartItemDto } from './dto/create-cart-item.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
import { PrismaService } from '../prisma/prisma.service';
import { ShoppingSessionsService } from '../shopping-sessions/shopping-sessions.service';

@Injectable()
export class CartItemsService {
  constructor(
    private prisma: PrismaService,
    private shoppingSessionService: ShoppingSessionsService
  ) {}

  async create({ bookId, quantity, shoppingSessionId }: CreateCartItemDto) {
    const existingCartItem = await this.prisma.cartItem.findFirst({
      where: { shoppingSessionId: shoppingSessionId, bookId },
    });

    if (existingCartItem) {
      const cartItem = await this.prisma.cartItem
        .update({
          where: { id: existingCartItem.id },
          data: { quantity: existingCartItem.quantity + quantity },
          include: {
            book: {
              include: {
                authors: {
                  include: {
                    author: true,
                  },
                },
                category: true,
              },
            },
          },
        })
        .then((cartItem) => ({
          ...cartItem,
          book: {
            ...cartItem.book,
            authors: cartItem.book.authors.map((a) => a.author),
          },
        }));

      this.shoppingSessionService.updateTotal(cartItem.shoppingSessionId);

      return cartItem;
    }

    const cartItem = await this.prisma.cartItem.create({
      data: { bookId, shoppingSessionId: shoppingSessionId, quantity },
      include: {
        book: {
          include: {
            authors: {
              include: {
                author: true,
              },
            },
            category: true,
          },
        },
      },
    });

    this.shoppingSessionService.updateTotal(cartItem.shoppingSessionId);

    return {
      ...cartItem,
      book: {
        ...cartItem.book,
        authors: cartItem.book.authors.map((a) => a.author),
      },
    };
  }

  findAll() {
    return this.prisma.cartItem.findMany();
  }

  findOne(id: number) {
    return this.prisma.cartItem.findUnique({ where: { id } });
  }

  async update(id: number, data: UpdateCartItemDto) {
    const cartItem = await this.prisma.cartItem.update({
      where: { id },
      data,
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
    });

    this.shoppingSessionService.updateTotal(cartItem.shoppingSessionId);

    return {
      ...cartItem,
      book: {
        ...cartItem.book,
        authors: cartItem.book.authors.map((a) => a.author),
      },
    };
  }

  async remove(id: number) {
    const cartItem = await this.prisma.cartItem.delete({
      where: { id },
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
    });

    this.shoppingSessionService.updateTotal(cartItem.shoppingSessionId);

    return {
      ...cartItem,
      book: {
        ...cartItem.book,
        authors: cartItem.book.authors.map((a) => a.author),
      },
    };
  }
}
