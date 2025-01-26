import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { decode } from 'jsonwebtoken';
import { Book, ShoppingSession } from '@prisma/client';
import { getUserIdFromAccessToken } from '../common/utils/get-user-id-from-access-token';

interface CartItem {
  bookId: Book['id'];
  quantity: number;
}

@Injectable()
export class ShoppingSessionsService {
  constructor(private prisma: PrismaService) {}

  async create(authHeader: string) {
    const userId = getUserIdFromAccessToken(authHeader);

    if (!userId) {
      throw new UnauthorizedException('You should log in');
    }

    const shoppingSession = await this.prisma.shoppingSession.create({
      data: {
        total: 0,
        userId,
      },
      include: {
        cartItems: true,
      },
    });

    return {
      ...shoppingSession,
      cartItems: [],
    };
  }

  async createManyCartItems(
    authHeader: string,
    shoppingSessionId: ShoppingSession['id'],
    cartItems: CartItem[],
  ) {
    const userId = String(decode(authHeader.split(' ')[1]).sub);

    const shoppingSession = await this.prisma.shoppingSession.findUnique({
      where: { id: shoppingSessionId },
      select: { id: true, cartItems: true, userId: true },
    });

    if (!shoppingSession) {
      throw new NotFoundException('Shopping session does not exist');
    }

    if (shoppingSession.userId !== userId) {
      throw new ForbiddenException(
        'You do not have permission to modify this shopping session',
      );
    }

    const existingCartItem: CartItem[] = shoppingSession.cartItems.map(
      ({ bookId, quantity }) => ({ bookId, quantity }),
    );

    const uniqueCartItems = new Set([...existingCartItem, ...cartItems]);

    const updatedShoppingSession = await this.prisma.shoppingSession.update({
      where: { id: shoppingSessionId },
      data: {
        cartItems: {
          deleteMany: {},
          createMany: {
            data: [...uniqueCartItems].map(({ bookId, quantity }) => ({
              bookId,
              quantity,
            })),
            skipDuplicates: true,
          },
        },
      },
      include: {
        cartItems: {
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
        },
      },
    });

    return {
      ...updatedShoppingSession,
      cartItems: updatedShoppingSession?.cartItems.map((ct) => ({
        ...ct,
        book: { ...ct.book, authors: ct.book.authors.map((a) => a.author) },
      })),
    };
  }

  async findOne(authHeader: string) {
    const userId = getUserIdFromAccessToken(authHeader);

    if (!userId) {
      throw new UnauthorizedException('You should log in');
    }

    const shoppingSession = await this.prisma.shoppingSession.findUnique({
      where: { userId },
      include: {
        cartItems: {
          include: {
            book: {
              include: {
                authors: {
                  include: { author: true },
                },
              },
            },
          },
        },
      },
    });

    if (!shoppingSession) {
      return this.create(authHeader);
    }

    return {
      ...shoppingSession,
      cartItems: shoppingSession?.cartItems.map((ct) => ({
        ...ct,
        book: { ...ct.book, authors: ct.book.authors.map((a) => a.author) },
      })),
    };
  }

  async remove(authHeader: string) {
    const userId = getUserIdFromAccessToken(authHeader);

    if (!userId) {
      throw new UnauthorizedException('You should log in');
    }

    return this.prisma.shoppingSession.delete({ where: { userId } });
  }
}
