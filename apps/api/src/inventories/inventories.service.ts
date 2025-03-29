import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Book } from '@prisma/client';

@Injectable()
export class InventoriesService {
  constructor(private prisma: PrismaService) {}

  findOne(bookId: Book['id']) {
    return this.prisma.inventory.findFirst({
      where: { book: { id: bookId } },
    });
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
}
