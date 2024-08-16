import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthorsService {
  constructor(private prisma: PrismaService) {}

  create(data: Prisma.AuthorCreateInput) {
    return this.prisma.author.create({ data });
  }

  findAll(opts: { page?: number; size?: number; nameLike?: string }) {
    return this.prisma.author.findMany({
      where: { name: { contains: opts.nameLike ?? '', mode: 'insensitive' } },
      take: opts.size || 20,
      skip: (opts.size || 20) * ((opts.page || 1) - 1),
    });
  }

  findOne(where: Prisma.AuthorWhereUniqueInput) {
    return this.prisma.author.findUnique({ where });
  }

  update(where: Prisma.AuthorWhereUniqueInput, data: Prisma.AuthorUpdateInput) {
    return this.prisma.author.update({ where, data });
  }

  remove(where: Prisma.AuthorWhereUniqueInput) {
    return this.prisma.author.delete({ where });
  }
}
