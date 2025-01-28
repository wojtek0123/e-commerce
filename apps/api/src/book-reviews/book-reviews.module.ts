import { Module } from '@nestjs/common';
import { BookReviewsService } from './book-reviews.service';
import { BookReviewsController } from './book-reviews.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [BookReviewsController],
  providers: [BookReviewsService, PrismaService],
})
export class BookReviewsModule {}
