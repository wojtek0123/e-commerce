import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, Tag } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBookDto } from './dto/create-book.dto';
import { parseQueryParams } from '../common/utils/parse-query-params';
import { parseNumber } from '../common/utils/parse-number';

@Injectable()
export class BooksService {
  constructor(private prisma: PrismaService) {}

  create(data: CreateBookDto) {
    return this.prisma.inventory.create({
      data: {
        quantity: data.quantity,
        book: {
          create: {
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
            publisher: {
              connectOrCreate: {
                create: { name: data.publisherName ?? '' },
                where: { id: data.publisherId ?? '' },
              },
            },
          },
        },
      },
      include: {
        book: {
          include: {
            authors: { include: { author: true } },
          },
        },
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
      const pageNumber = parseNumber(page);
      const sizeNumber = parseNumber(size);

      const parsedCategories = parseQueryParams(categoryIdIn);
      const parsedTags = parseQueryParams(tagIn);
      const parsedAuthors = parseQueryParams(authorIdIn);

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
              gte: parseNumber(priceFrom) || 0,
              lte: parseNumber(priceTo) || Number.MAX_SAFE_INTEGER,
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
            category: true,
            reviews: true,
          },
          ...(pageNumber &&
            sizeNumber && { skip: (pageNumber - 1) * sizeNumber }),
          ...(sizeNumber && { take: sizeNumber }),
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
    } catch (error: unknown) {
      throw new Error('Error occurred while searching books');
    }
  }

  async findOne(id: string) {
    const book = await this.prisma.book.findUnique({
      where: { id },
      include: {
        inventory: true,
        authors: { include: { author: true } },
        category: true,
        reviews: { include: { user: true } },
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
