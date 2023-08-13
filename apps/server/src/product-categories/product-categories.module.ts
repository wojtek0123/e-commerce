import { Module } from '@nestjs/common';
import { ProductCategoriesService } from './product-categories.service';
import { ProductCategoriesController } from './product-categories.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  controllers: [ProductCategoriesController],
  providers: [ProductCategoriesService],
  imports: [PrismaModule],
})
export class ProductCategoriesModule {}
