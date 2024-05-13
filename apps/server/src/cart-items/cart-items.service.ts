import { Injectable } from '@nestjs/common';
import { CreateCartItemDto } from './dto/create-cart-item.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
import { PrismaService } from '../prisma/prisma.service';
import { decode } from 'jsonwebtoken';

@Injectable()
export class CartItemsService {
  constructor(private prisma: PrismaService) {}

  create(data: CreateCartItemDto) {
    return this.prisma.cartItem.create({ data });
  }

  findAll() {
    return this.prisma.cartItem.findMany();
  }

  findOne(id: number) {
    return this.prisma.cartItem.findUnique({ where: { id } });
  }

  findUserCartItems(authHeader: string) {
    console.log(authHeader);
    const decodedAccessToken = decode(authHeader.split(' ')[1]);
    console.log(decodedAccessToken);

    return this.prisma.cartItem.findMany({
      where: { userId: +decodedAccessToken.sub },
    });
  }

  update(id: number, data: UpdateCartItemDto) {
    return this.prisma.cartItem.update({ where: { id }, data });
  }

  remove(id: number) {
    return this.prisma.cartItem.delete({ where: { id } });
  }
}
