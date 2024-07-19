import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { GetBooksBodyDto } from './dto/get-books.dto';
import { CreateBookDto } from './dto/create-book.dto';

@Injectable()
export class BooksService {
  constructor(private prisma: PrismaService) {}

  create(data: CreateBookDto) {
    return this.prisma.book.create({
      data: {
        title: data.title,
        description: data.description,
        language: data.language,
        pages: data.pages,
        publishedDate: data.publishedDate,
        price: data.price,
        coverImage: data.coverImage,
        tag: data.tag,
        authors: {
          createMany: {
            data: data.authorsId.map((authorId) => ({ authorId })),
          },
        },
        category: { connect: { id: data.categoryId } },
        productInventory: { create: { quantity: data.quantity } },
        publisher: {
          connectOrCreate: {
            create: { name: data.publisherName },
            where: { id: data.publisherId },
          },
        },
      },
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
    authorNamesIn,
  }: GetBooksBodyDto) {
    // let where: Prisma.BookScalarWhereInput = {};

    if (
      categoryIdsIn ||
      tagsIn ||
      titleLike ||
      priceFrom ||
      priceTo ||
      authorNamesIn
    ) {
      //   where = {
      //     AND: [
      //       { tag: { in: tagsIn } },
      //       { categoryId: { in: categoryIdsIn } },
      //       { title: { contains: titleLike, mode: 'insensitive' } },
      //       { price: { gte: priceFrom, lte: priceTo } },
      //     ],
      //   };
    }

    const authorsId = await this.prisma.author
      .findMany({ where: { name: { in: authorNamesIn } } })
      .then((authors) => authors.map(({ id }) => id));

    const books = await this.prisma.book.findMany({
      where: {
        AND: [
          { tag: { in: tagsIn } },
          { categoryId: { in: categoryIdsIn } },
          { title: { contains: titleLike, mode: 'insensitive' } },
          { price: { gte: priceFrom, lte: priceTo } },
          { authors: { some: { authorId: { in: authorsId } } } },
        ],
      },
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

  async findOne(id: number) {
    const book = await this.prisma.book.findUnique({
      where: { id },
      include: { authors: { include: { author: true } }, category: true },
    });

    if (!book) {
      throw new NotFoundException('Book not found');
    }

    return { ...book, authors: book.authors.map((a) => a.author) };
  }

  update(id: number, data: Prisma.BookUpdateInput) {
    return this.prisma.book.update({ where: { id }, data });
  }

  remove(id: number) {
    return this.prisma.book.delete({ where: { id } });
  }
}
