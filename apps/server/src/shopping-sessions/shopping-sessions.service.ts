import { Injectable } from '@nestjs/common';
import { CreateShoppingSessionDto } from './dto/create-shopping-session.dto';
import { UpdateShoppingSessionDto } from './dto/update-shopping-session.dto';
import { PrismaService } from '../prisma/prisma.service';
import { decode } from 'jsonwebtoken';
import { ShoppingSessionEntity } from './entities/shopping-session.entity';

@Injectable()
export class ShoppingSessionsService {
  constructor(private prisma: PrismaService) {}

  create(data: CreateShoppingSessionDto) {
    return 'This action adds a new shoppingSession';
  }

  findAll() {
    return `This action returns all shoppingSessions`;
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

    // this.prisma.shoppingSession.update({
    //   where: { userId: shoppingSession.userId },
    //   data: {
    //     total: shoppingSession.cartItems.reduce(
    //       (acc, cur) => acc + cur.book.price * cur.quantity,
    //       0
    //     ),
    //   },
    // });

    return {
      ...shoppingSession,
      // total: shoppingSession.cartItems.reduce(
      //   (acc, cur) => acc + cur.book.price * cur.quantity,
      //   0
      // ),
      cartItems: shoppingSession?.cartItems.map((ct) => ({
        ...ct,
        book: { ...ct.book, authors: ct.book.authors.map((a) => a.author) },
      })),
    };

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

  update(id: number, updateShoppingSessionDto: UpdateShoppingSessionDto) {
    return `This action updates a #${id} shoppingSession`;
  }

  remove(id: number) {
    return `This action removes a #${id} shoppingSession`;
  }
}
