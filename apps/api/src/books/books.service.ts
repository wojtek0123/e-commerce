import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, Tag } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
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

  private _parseQueryParams(queryParam?: string) {
    if (typeof queryParam === 'string') {
      return queryParam?.replaceAll('_', ' ').split(',') ?? undefined;
    }
  }

  async findMany({
    categoryNamesIn,
    tagsIn,
    titleLike,
    priceFrom,
    priceTo,
    size,
    page,
    authorNamesIn,
  }: {
    categoryNamesIn?: string;
    tagsIn?: string;
    titleLike?: string;
    priceFrom?: string;
    priceTo?: string;
    size?: string;
    page?: string;
    authorNamesIn?: string;
  }) {
    const pageNumber = +page || 1;
    const sizeNumber = +size || 20;

    const authorsId = await this.prisma.author
      .findMany({
        where: { name: { in: this._parseQueryParams(authorNamesIn) } },
      })
      .then((authors) => authors.map(({ id }) => id));

    const books = await this.prisma.book.findMany({
      where: {
        AND: [
          { tag: { in: this._parseQueryParams(tagsIn) as Tag[] } },
          {
            category: { name: { in: this._parseQueryParams(categoryNamesIn) } },
          },
          { title: { contains: titleLike ?? '', mode: 'insensitive' } },
          { price: { gte: +priceFrom || 0, lte: +priceTo || 100000000 } },
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
      skip: (pageNumber - 1) * sizeNumber,
      take: sizeNumber,
      orderBy: { title: 'asc' },
    });

    const total = (
      await this.prisma.book.findMany({
        where: {
          AND: [
            { tag: { in: this._parseQueryParams(tagsIn) as Tag[] } },
            {
              category: {
                name: { in: this._parseQueryParams(categoryNamesIn) },
              },
            },
            { title: { contains: titleLike ?? '', mode: 'insensitive' } },
            { price: { gte: +priceFrom || 0, lte: +priceTo || 100000000 } },
            { authors: { some: { authorId: { in: authorsId } } } },
          ],
        },
      })
    ).length;

    return {
      items: books.map((book) => ({
        ...book,
        authors: book.authors.map((a) => a.author),
      })),
      total,
      count: books.length,
      page: pageNumber,
    };
  }

  async findOne(id: number) {
    console.log(id);
    const book = await this.prisma.book.findUnique({
      where: { id },
      include: {
        productInventory: true,
        authors: { include: { author: true } },
        category: true,
      },
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
