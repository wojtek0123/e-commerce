import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { GetBooksBodyDto } from './dto/get-books.dto';

@Injectable()
export class BooksService {
  constructor(private prisma: PrismaService) {}

  create(data: Prisma.BookCreateInput) {
    return this.prisma.book.create({ data });
  }

  findAll(where?: Prisma.BookWhereInput) {
    return this.prisma.book.findMany({
      where,
    });
  }

  async findMany({
    categoryIdsIn,
    tagsIn,
    titleLike,
    priceFrom,
    priceTo,
    size,
    page,
  }: GetBooksBodyDto) {
    let where: Prisma.BookScalarWhereInput = {};

    if (categoryIdsIn || tagsIn || titleLike || priceFrom || priceTo) {
      where = {
        AND: [
          { tag: { in: tagsIn } },
          { categoryId: { in: categoryIdsIn } },
          { title: { contains: titleLike, mode: 'insensitive' } },
          { price: { gte: priceFrom, lte: priceTo } },
        ],
      };
    }

    const books = await this.prisma.book.findMany({
      where,
      include: {
        authors: {
          include: {
            author: true,
          },
        },
      },
      skip: size * (page - 1),
      take: size,
    });

    const total = (await this.prisma.book.findMany()).length;

    return {
      items: books.map((book) => ({
        ...book,
        authors: book.authors.map((a) => a.author),
      })),
      total,
      count: books.length,
      page,
    };
  }

  async findOne(where: Prisma.BookWhereUniqueInput) {
    const book = await this.prisma.book.findUnique({
      where,
      include: { authors: { include: { author: true } }, category: true },
    });

    if (!book) {
      throw new NotFoundException('Book not found');
    }

    return { ...book, authors: book.authors.map((a) => a.author) };
  }

  update(where: Prisma.BookWhereUniqueInput, data: Prisma.BookUpdateInput) {
    return this.prisma.book.update({ where, data });
  }

  remove(where: Prisma.BookWhereUniqueInput) {
    return this.prisma.book.delete({ where });
  }
}
