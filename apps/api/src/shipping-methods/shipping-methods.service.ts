import { Injectable } from '@nestjs/common';
import { CreateShippingMethodDto } from './dto/create-shipping-method.dto';
import { UpdateShippingMethodDto } from './dto/update-shipping-method.dto';
import { PrismaService } from '../prisma/prisma.service';
import { ShippingMethod } from '@prisma/client';

@Injectable()
export class ShippingMethodsService {
  constructor(private prisma: PrismaService) {}

  create(data: CreateShippingMethodDto) {
    return this.prisma.shippingMethod.create({ data });
  }

  findAll() {
    return this.prisma.shippingMethod.findMany();
  }

  findOne(id: ShippingMethod['id']) {
    return this.prisma.shippingMethod.findUnique({ where: { id } });
  }

  update(id: ShippingMethod['id'], data: UpdateShippingMethodDto) {
    return this.prisma.shippingMethod.update({ where: { id }, data });
  }

  remove(id: string) {
    return this.prisma.shippingMethod.delete({ where: { id } });
  }
}
