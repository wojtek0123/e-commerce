import { Module } from '@nestjs/common';
import { ProductInventoriesService } from './product-inventories.service';
import { ProductInventoriesController } from './product-inventories.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [ProductInventoriesController],
  providers: [ProductInventoriesService, PrismaService],
})
export class ProductInventoriesModule {}
