import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
// import { CreateShoppingSessionDto } from './dto/create-shopping-session.dto';
// import { UpdateShoppingSessionDto } from './dto/update-shopping-session.dto';
import { PrismaService } from '../prisma/prisma.service';
import { decode } from 'jsonwebtoken';
import { ShoppingSessionEntity } from './entities/shopping-session.entity';

interface CartItem {
  bookId: number;
  quantity: number;
}

@Injectable()
export class ShoppingSessionsService {
  constructor(private prisma: PrismaService) {}

  // create(data: CreateShoppingSessionDto) {
  //   return 'This action adds a new shoppingSession';
  // }

  findAll() {
    return `This action returns all shoppingSessions`;
  }

  async createManyCartItems(
    authHeader: string,
    shoppingSessionId: number,
    cartItems: CartItem[]
  ) {
    const userId = +decode(authHeader.split(' ')[1]).sub;

    const shoppingSession = await this.prisma.shoppingSession.findUnique({
      where: { id: shoppingSessionId },
      select: { id: true, cartItems: true, userId: true },
    });

    if (!shoppingSession) {
      throw new NotFoundException('Shopping session does not exist');
    }

    if (shoppingSession.userId !== userId) {
      throw new ForbiddenException(
        'You do not have permission to modify this shopping session'
      );
    }

    const existingCartItem: CartItem[] = shoppingSession.cartItems.map(
      ({ bookId, quantity }) => ({ bookId, quantity })
    );

    const uniqueCartItems = new Set([...existingCartItem, ...cartItems]);

    return this.prisma.shoppingSession
      .update({
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
      })
      .then((shoppingSession) => ({
        ...shoppingSession,
        cartItems: shoppingSession?.cartItems.map((ct) => ({
          ...ct,
          book: { ...ct.book, authors: ct.book.authors.map((a) => a.author) },
        })),
      }));

    // this.prisma.shoppingSession.update({
    //   where: { id: shoppingSessionId },
    //   data: {
    //     cartItems: {
    //       connectOrCreate: [
    //         {
    //           where: {
    //             bookId_shoppingSessionId: {
    //               bookId,
    //               shoppingSessionId: shoppingSession.id,
    //             },
    //           },
    //           create: {
    //             bookId,
    //             quantity,
    //           },
    //           connect: {},
    //         },
    //       ],
    //     },
    //   },
    // });
  }

  async updateTotal(shoppingSessionId: ShoppingSessionEntity['id']) {
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

    return this.prisma.shoppingSession.update({
      where: { id: shoppingSessionId },
      data: {
        total: shoppingSession.cartItems.reduce(
          (acc, ct) => acc + ct.book.price * ct.quantity,
          0
        ),
      },
    });
  }

  async findOne(authHeader: string) {
    const decodedAccessToken = decode(authHeader.split(' ')[1]);

    const shoppingSession = await this.prisma.shoppingSession.findUnique({
      where: { userId: +decodedAccessToken.sub },
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
      return this.prisma.shoppingSession
        .create({
          data: {
            total: 0,
            userId: +decodedAccessToken.sub,
          },
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
        })
        .then((shoppingSession) => ({
          ...shoppingSession,
          cartItems: shoppingSession?.cartItems.map((ct) => ({
            ...ct,
            book: { ...ct.book, authors: ct.book.authors.map((a) => a.author) },
          })),
        }));
    }
    return {
      ...shoppingSession,
      cartItems: shoppingSession?.cartItems.map((ct) => ({
        ...ct,
        book: { ...ct.book, authors: ct.book.authors.map((a) => a.author) },
      })),
    };
  }

  // update(id: number, updateShoppingSessionDto: UpdateShoppingSessionDto) {
  //   return `This action updates a #${id} shoppingSession`;
  // }

  async remove(authHeader: string) {
    const userId = +decode(authHeader.split(' ')[1]).sub;
    return this.prisma.shoppingSession.delete({ where: { userId } });
  }
}
