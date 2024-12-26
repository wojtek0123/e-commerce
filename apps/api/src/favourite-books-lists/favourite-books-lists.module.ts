import { Module } from '@nestjs/common';
import { FavouriteBooksListsService } from './favourite-books-lists.service';
import { FavouriteBooksListsController } from './favourite-books-lists.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [FavouriteBooksListsController],
  providers: [FavouriteBooksListsService, PrismaService],
})
export class FavouriteBooksListsModule {}
