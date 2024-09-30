import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Book } from '@prisma/client';

@Injectable()
export class ProductInventoriesService {
  constructor(private prisma: PrismaService) {}

  findOne(bookId: Book['id']) {
    return this.prisma.productInventory.findFirst({
      where: { book: { id: bookId } },
    });
  }
}
