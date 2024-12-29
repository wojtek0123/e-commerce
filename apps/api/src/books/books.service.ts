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
            create: { name: data.publisherName ?? '' },
            where: { id: data.publisherId ?? '' },
          },
        },
      },
      include: {
        authors: { include: { author: true } },
      },
    });
  }

  async findMany({
    categoryIdIn,
    tagIn,
    titleLike,
    priceFrom,
    priceTo,
    size,
    page,
    authorIdIn,
    sortBy,
    sortByMode,
  }: {
    categoryIdIn?: string;
    tagIn?: string;
    titleLike?: string;
    priceFrom?: string;
    priceTo?: string;
    size?: string;
    page?: string;
    authorIdIn?: string;
    sortBy?: string;
    sortByMode?: string;
  }) {
    try {
      const pageNumber = this.parseNumber(page, 1);
      const sizeNumber = this.parseNumber(size, 20);

      const parsedCategories = this._parseQueryParams(categoryIdIn);
      const parsedTags = this._parseQueryParams(tagIn);
      const parsedAuthors = this._parseQueryParams(authorIdIn);

      const parsedSortByMode = ['asc', 'desc'].includes(sortByMode)
        ? sortByMode
        : 'asc';

      const parsedSortBy = ['title', 'price', 'publishedDate'].includes(sortBy)
        ? sortBy
        : 'title';

      const whereClause: Prisma.BookWhereInput = {
        AND: [
          parsedTags.length > 0 ? { tag: { in: parsedTags as Tag[] } } : {},
          parsedCategories.length > 0
            ? { category: { id: { in: parsedCategories } } }
            : {},
          titleLike
            ? { title: { contains: titleLike, mode: 'insensitive' } }
            : {},
          {
            price: {
              gte: this.parseNumber(priceFrom, 0),
              lte: this.parseNumber(priceTo, Number.MAX_SAFE_INTEGER),
            },
          },
          parsedAuthors.length > 0
            ? { authors: { some: { authorId: { in: parsedAuthors } } } }
            : {},
        ],
      };

      const [books, total] = await Promise.all([
        this.prisma.book.findMany({
          where: whereClause,
          include: {
            authors: { include: { author: true } },
          },
          skip: (pageNumber - 1) * sizeNumber,
          take: sizeNumber,
          orderBy: { [parsedSortBy]: parsedSortByMode },
        }),
        this.prisma.book.count({ where: whereClause }),
      ]);

      return {
        items: books.map((book) => ({
          ...book,
          authors: book.authors.map((a) => a.author),
        })),
        total,
        count: books.length,
        page: pageNumber,
      };
    } catch (error) {
      throw new Error('Error occur while searching books');
    }
  }

  private _parseQueryParams(param?: string): string[] {
    return (
      param
        ?.split(',')
        .filter(Boolean)
        .map((item) => item.trim()) || []
    );
  }

  private parseNumber(value: string | undefined, fallback: number): number {
    const parsedValue = value ? parseInt(value, 10) : NaN;
    return isNaN(parsedValue) ? fallback : parsedValue;
  }
  async findOne(id: string) {
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

  update(id: string, data: Prisma.BookUpdateInput) {
    return this.prisma.book.update({ where: { id }, data });
  }

  remove(ids: string) {
    const parsedIds = ids.split(',');

    return this.prisma.book.deleteMany({ where: { id: { in: parsedIds } } });
  }
}
