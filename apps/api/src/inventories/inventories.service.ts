import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Book, Prisma } from '@prisma/client';
import { parseNumber } from '../common/utils/parse-number';
import { CreateInventoryDto } from './dto/create-inventory.dto';

@Injectable()
export class InventoriesService {
  constructor(private prisma: PrismaService) {}

  findOne(bookId: Book['id']) {
    return this.prisma.inventory.findFirst({
      where: { book: { id: bookId } },
    });
  }

  async findAll({
    titleLike,
    size,
    page,
    sortBy,
    sortByMode,
  }: {
    titleLike?: string;
    size?: string;
    page?: string;
    sortBy?: string;
    sortByMode?: string;
  }) {
    const pageNumber = parseNumber(page);
    const sizeNumber = parseNumber(size);

    const parsedSortByMode = ['asc', 'desc'].includes(sortByMode)
      ? sortByMode
      : 'asc';

    const parsedSortBy = ['quantity', 'createdAt'].includes(sortBy)
      ? sortBy
      : 'createdAt';

    const where: Prisma.InventoryWhereInput = {
      AND: [
        titleLike
          ? {
              book: { title: { contains: titleLike, mode: 'insensitive' } },
            }
          : {},
      ],
    };

    try {
      const [inventories, total] = await Promise.all([
        await this.prisma.inventory.findMany({
          where,
          include: {
            book: {
              include: {
                authors: { include: { author: true } },
              },
            },
          },
          ...(pageNumber &&
            sizeNumber && { skip: (pageNumber - 1) * sizeNumber }),
          ...(sizeNumber && { take: sizeNumber }),
          orderBy: { [parsedSortBy]: parsedSortByMode },
        }),
        this.prisma.inventory.count({ where }),
      ]);

      return {
        items: inventories.map((inventory) => ({
          ...inventory,
          book: {
            ...inventory.book,
            authors: inventory.book.authors.map((a) => a.author),
          },
        })),
        total,
        count: inventories.length,
        page: pageNumber || 1,
      };
    } catch (error: unknown) {
      throw new Error('Error occurred while getting inventories');
    }
  }

  async updateQuantity(bookId: Book['id'], quantity: number) {
    const inventory = await this.prisma.inventory.findUnique({
      where: { bookId },
    });

    if (!inventory) {
      throw new NotFoundException(
        `Not found inventory object for book with ${bookId} id.`,
      );
    }

    return this.prisma.inventory.update({
      where: {
        bookId,
      },
      data: {
        quantity: inventory.quantity + quantity,
      },
    });
  }

  create(data: CreateInventoryDto) {
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
}
