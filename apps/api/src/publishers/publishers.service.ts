import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PublishersService {
  constructor(private prisma: PrismaService) {}

  create(data: Prisma.PublisherCreateInput) {
    return this.prisma.publisher.create({ data });
  }

  findAll() {
    return this.prisma.publisher.findMany();
  }

  findOne(where: Prisma.PublisherWhereUniqueInput) {
    return this.prisma.publisher.findUnique({ where });
  }

  update(
    where: Prisma.PublisherWhereUniqueInput,
    data: Prisma.PublisherUpdateInput,
  ) {
    return this.prisma.publisher.update({ where, data });
  }

  remove(where: Prisma.PublisherWhereUniqueInput) {
    return this.prisma.publisher.delete({ where });
  }
}
