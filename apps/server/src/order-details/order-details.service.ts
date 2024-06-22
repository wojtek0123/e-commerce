import { Injectable } from '@nestjs/common';
import { CreateOrderDetailDto } from './dto/create-order-detail.dto';
import { PrismaService } from '../prisma/prisma.service';
import { decode } from 'jsonwebtoken';

@Injectable()
export class OrderDetailsService {
  constructor(private readonly prisma: PrismaService) {}

  create(data: CreateOrderDetailDto, authHeader: string) {
    const userId = +decode(authHeader.split(' ')[1]).sub;
    return this.prisma.orderDetails.create({ data: { ...data, userId } });
  }

  findAll(authHeader: string) {
    const userId = +decode(authHeader.split(' ')[1]).sub;
    return this.prisma.orderDetails.findMany({ where: { userId } });
  }

  findOne(authHeader: string, id: number) {
    const userId = +decode(authHeader.split(' ')[1]).sub;

    return this.prisma.orderDetails.findUnique({ where: { id, userId } });
  }
}
