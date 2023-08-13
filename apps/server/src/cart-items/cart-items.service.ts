import { Injectable } from '@nestjs/common';
import { CreateCartItemDto } from './dto/create-cart-item.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CartItemsService {
  constructor(private prisma: PrismaService) {}

  create(createCartItemDto: CreateCartItemDto) {
    return this.prisma.cartItem.create({
      data: createCartItemDto,
    });
  }

  findAll() {
    return this.prisma.cartItem.findMany();
  }

  findOne(id: number) {
    return this.prisma.cartItem.findUnique({ where: { id } });
  }

  update(id: number, updateCartItemDto: UpdateCartItemDto) {
    return this.prisma.cartItem.update({
      where: { id },
      data: updateCartItemDto,
    });
  }

  remove(id: number) {
    return this.prisma.cartItem.delete({ where: { id } });
  }
}
