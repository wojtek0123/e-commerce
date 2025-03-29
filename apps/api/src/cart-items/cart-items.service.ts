import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateCartItemDto } from './dto/create-cart-item.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
import { PrismaService } from '../prisma/prisma.service';
import { decode } from 'jsonwebtoken';
import { Book, ShoppingSession } from '@prisma/client';
import { ShoppingSessionEntity } from '../shopping-sessions/entities/shopping-session.entity';

@Injectable()
export class CartItemsService {
  constructor(private prisma: PrismaService) {}

  async create(authHeader: string, { bookId, quantity }: CreateCartItemDto) {
    const userId = String(decode(authHeader.split(' ')[1]).sub);

    if (!userId) {
      throw new UnauthorizedException('You should log in');
    }

    const shoppingSession = await this.prisma.shoppingSession.findUnique({
      where: { userId },
      select: { id: true },
    });

    if (!shoppingSession) {
      throw new NotFoundException('Not found shopping session');
    }

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

    const availableAmount = await this.prisma.inventory.findUnique({
      where: { bookId },
    });

    if (existingCartItem) {
      if (existingCartItem.shoppingSession.user.id !== userId) {
        throw new ForbiddenException(
          'You do not have permission to modify this cart item',
        );
      }

      const concatQuantity = existingCartItem.quantity + quantity;

      const cartItem = await this.prisma.cartItem
        .update({
          where: { id: existingCartItem.id },
          data: {
            quantity:
              concatQuantity > availableAmount.quantity
                ? availableAmount.quantity
                : concatQuantity,
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

      try {
        this.#updateTotal(cartItem.shoppingSessionId);
      } catch (error) {
        throw new Error(
          error ?? 'Error occurred while updating total price of cart items',
        );
      }

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

    try {
      this.#updateTotal(cartItem.shoppingSessionId);
    } catch (error) {
      throw new Error(
        error ?? 'Error occurred while updating total price of cart items',
      );
    }

    return {
      ...cartItem,
      book: {
        ...cartItem.book,
        authors: cartItem.book.authors.map((a) => a.author),
      },
    };
  }

  async findOne(shoppingSessionId: ShoppingSession['id'], bookId: Book['id']) {
    const cartItem = await this.prisma.cartItem.findUnique({
      where: { bookId_shoppingSessionId: { bookId, shoppingSessionId } },
      include: { shoppingSession: { select: { userId: true } } },
    });

    if (!cartItem) {
      throw new NotFoundException('Not found cart item');
    }

    return cartItem;
  }

  async update(
    authHeader: string,
    shoppingSessionId: ShoppingSession['id'],
    bookId: Book['id'],
    data: UpdateCartItemDto,
  ) {
    const userId = String(decode(authHeader.split(' ')[1]).sub);

    if (!userId) {
      throw new UnauthorizedException('You should log in');
    }

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

    try {
      this.#updateTotal(cartItem.shoppingSessionId);
    } catch (error) {
      throw new Error(
        error ?? 'Error occurred while updating total price of cart items',
      );
    }

    return {
      ...updatedCartItem,
      book: {
        ...updatedCartItem.book,
        authors: updatedCartItem.book.authors.map((a) => a.author),
      },
    };
  }

  async remove(
    authHeader: string,
    shoppingSessionId: ShoppingSession['id'],
    bookId: Book['id'],
  ) {
    const userId = String(decode(authHeader.split(' ')[1]).sub);

    if (!userId) {
      throw new UnauthorizedException('You should log in');
    }

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

    if (!deletedCartItem) {
      throw new NotFoundException('Not found cart item');
    }

    try {
      this.#updateTotal(deletedCartItem.shoppingSessionId);
    } catch (error) {
      throw new Error(
        error ?? 'Error occurred while updating total price of cart items',
      );
    }

    return {
      ...deletedCartItem,
      book: {
        ...deletedCartItem.book,
        authors: deletedCartItem.book.authors.map((a) => a.author),
      },
    };
  }

  async #updateTotal(shoppingSessionId: ShoppingSessionEntity['id']) {
    const shoppingSession = await this.prisma.shoppingSession.findUnique({
      where: { id: shoppingSessionId },
      include: {
        cartItems: {
          include: {
            book: true,
          },
        },
      },
    });

    if (!shoppingSession) {
      throw new NotFoundException('Not found shopping session');
    }

    return this.prisma.shoppingSession.update({
      where: { id: shoppingSessionId },
      data: {
        total: shoppingSession.cartItems.reduce(
          (acc, ct) => acc + ct.book.price * ct.quantity,
          0,
        ),
      },
    });
  }
}
