import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PublishersService {
  constructor(private prisma: PrismaService) {}

  create(data: Prisma.PublisherCreateInput) {
    return this.prisma.publisher.create({ data });
  }

  findAll(opts: { nameLike?: string }) {
    return this.prisma.publisher.findMany({
      where: {
        name: {
          contains: opts.nameLike ? opts.nameLike : '',
          mode: 'insensitive',
        },
      },
    });
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

  remove(ids: string) {
    const parsedIds = ids.split(',');

    return this.prisma.publisher.deleteMany({
      where: { id: { in: parsedIds } },
    });
  }
}
