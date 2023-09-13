import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  create(data: Prisma.ProductCreateInput) {
    return this.prisma.product.create({ data });
  }

  findAll() {
    return this.prisma.product.findMany();
  }

  findOne(where: Prisma.ProductWhereUniqueInput) {
    return this.prisma.product.findUnique({ where });
  }

  update(
    where: Prisma.ProductWhereUniqueInput,
    data: Prisma.ProductUpdateInput
  ) {
    return this.prisma.product.update({ where, data });
  }

  remove(where: Prisma.ProductWhereUniqueInput) {
    return this.prisma.product.delete({ where });
  }
}
