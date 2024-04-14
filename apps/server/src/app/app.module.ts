import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from '../users/users.module';
import { AuthModule } from '../auth/auth.module';
import { BooksModule } from '../books/books.module';
import { AuthorsModule } from '../authors/authors.module';
import { PublishersModule } from '../publishers/publishers.module';
import { CategoriesModule } from '../categories/categories.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  controllers: [AppController],
  providers: [AppService],
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    UsersModule,
    AuthModule,
    BooksModule,
    AuthorsModule,
    PublishersModule,
    CategoriesModule,
  ],
})
export class AppModule {}
