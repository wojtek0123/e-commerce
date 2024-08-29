import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCartItemDto } from './dto/create-cart-item.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
import { PrismaService } from '../prisma/prisma.service';
import { ShoppingSessionsService } from '../shopping-sessions/shopping-sessions.service';
import { decode } from 'jsonwebtoken';

@Injectable()
export class CartItemsService {
  constructor(
    private prisma: PrismaService,
    private shoppingSessionService: ShoppingSessionsService,
  ) {}

  // async createMany(authHeader: string, data: CreateCartItemDto[]) {}

  async create(authHeader: string, { bookId, quantity }: CreateCartItemDto) {
    const userId = +decode(authHeader.split(' ')[1]).sub;

    const shoppingSession = await this.prisma.shoppingSession.findUnique({
      where: { userId },
      select: { id: true },
    });

    const existingCartItem = await this.prisma.cartItem.findUnique({
      where: {
        bookId_shoppingSessionId: {
          bookId,
          shoppingSessionId: shoppingSession.id,
        },
      },
      include: {
        shoppingSession: {
          include: { user: { select: { id: true } } },
        },
      },
    });

    if (existingCartItem) {
      if (existingCartItem.shoppingSession.user.id !== userId) {
        throw new ForbiddenException(
          'You do not have permission to modify this cart item',
        );
      }

      const cartItem = await this.prisma.cartItem
        .update({
          where: { id: existingCartItem.id },
          data: {
            quantity: existingCartItem.quantity + quantity,
          },
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
            shoppingSession: {
              include: {
                user: {
                  select: { id: true },
                },
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
      data: { bookId, shoppingSessionId: shoppingSession.id, quantity },
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

  findOne(shoppingSessionId: number, bookId: number) {
    return this.prisma.cartItem.findUnique({
      where: { bookId_shoppingSessionId: { bookId, shoppingSessionId } },
      include: { shoppingSession: { select: { userId: true } } },
    });
  }

  async update(
    authHeader: string,
    shoppingSessionId: number,
    bookId: number,
    data: UpdateCartItemDto,
  ) {
    const userId = +decode(authHeader.split(' ')[1]).sub;

    const cartItem = await this.findOne(shoppingSessionId, bookId);

    if (!cartItem) {
      throw new NotFoundException('This cart item does not exist');
    }

    if (cartItem.shoppingSession.userId !== userId) {
      throw new ForbiddenException(
        'You do not have permission to modify this cart item',
      );
    }

    const updatedCartItem = await this.prisma.cartItem.update({
      where: {
        bookId_shoppingSessionId: {
          bookId,
          shoppingSessionId,
        },
        shoppingSession: { userId },
      },
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

    this.shoppingSessionService.updateTotal(updatedCartItem.shoppingSessionId);

    return {
      ...updatedCartItem,
      book: {
        ...updatedCartItem.book,
        authors: updatedCartItem.book.authors.map((a) => a.author),
      },
    };
  }

  async remove(authHeader: string, shoppingSessionId: number, bookId: number) {
    const userId = +decode(authHeader.split(' ')[1]).sub;

    const deletedCartItem = await this.prisma.cartItem.delete({
      where: {
        bookId_shoppingSessionId: { bookId, shoppingSessionId },
        shoppingSession: { userId },
      },
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

    this.shoppingSessionService.updateTotal(deletedCartItem.shoppingSessionId);

    return {
      ...deletedCartItem,
      book: {
        ...deletedCartItem.book,
        authors: deletedCartItem.book.authors.map((a) => a.author),
      },
    };
  }
}
