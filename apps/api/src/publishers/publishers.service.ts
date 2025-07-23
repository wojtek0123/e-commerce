import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PublishersService {
  constructor(private prisma: PrismaService) {}

  create(data: Prisma.PublisherCreateInput) {
    return this.prisma.publisher.create({ data });
  }

  findAll(opts: {
    page?: number;
    size?: number;
    nameLike?: string;
    nameIn?: string;
  }) {
    return this.prisma.publisher.findMany({
      where: {
        name: {
          contains: opts.nameLike ? opts.nameLike : '',
          mode: 'insensitive',
        },
      },
      take: opts.size || 20,
      skip: (opts.size || 20) * ((opts.page || 1) - 1),
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

  remove(id: string) {
    return this.prisma.publisher.delete({ where: { id } });
  }
}
