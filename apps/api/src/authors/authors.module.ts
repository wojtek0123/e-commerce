import { Module } from '@nestjs/common';
import { AuthorsService } from './authors.service';
import { AuthorsController } from './authors.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [AuthorsController],
  providers: [AuthorsService, PrismaService],
})
export class AuthorsModule {}
