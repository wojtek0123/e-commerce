import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class BooksService {
  constructor(private prisma: PrismaService) {}

  create(data: Prisma.BookCreateInput) {
    return this.prisma.book.create({ data });
  }

  findAll() {
    return this.prisma.book.findMany();
  }

  findOne(where: Prisma.BookWhereUniqueInput) {
    return this.prisma.book.findUnique({ where });
  }

  update(where: Prisma.BookWhereUniqueInput, data: Prisma.BookUpdateInput) {
    return this.prisma.book.update({ where, data });
  }

  remove(where: Prisma.BookWhereUniqueInput) {
    return this.prisma.book.delete({ where });
  }
}
