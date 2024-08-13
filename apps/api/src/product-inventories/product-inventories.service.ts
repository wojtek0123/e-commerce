import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProductInventoriesService {
  constructor(private prisma: PrismaService) {}

  findOne(bookId: number) {
    return this.prisma.productInventory.findFirst({
      where: { book: { id: bookId } },
    });
  }
}
