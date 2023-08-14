import { Injectable } from '@nestjs/common';
import { CreateOrderDetailDto } from './dto/create-order-detail.dto';
import { UpdateOrderDetailDto } from './dto/update-order-detail.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class OrderDetailsService {
  constructor(private prisma: PrismaService) {}

  create(createOrderDetailDto: CreateOrderDetailDto) {
    return this.prisma.orderDetails.create({ data: createOrderDetailDto });
  }

  findAll() {
    return this.prisma.orderDetails.findMany();
  }

  findOne(id: number) {
    return this.prisma.orderDetails.findUnique({ where: { id } });
  }

  update(id: number, updateOrderDetailDto: UpdateOrderDetailDto) {
    return this.prisma.orderDetails.update({
      where: { id },
      data: updateOrderDetailDto,
    });
  }

  remove(id: number) {
    return this.prisma.orderDetails.delete({ where: { id } });
  }
}
