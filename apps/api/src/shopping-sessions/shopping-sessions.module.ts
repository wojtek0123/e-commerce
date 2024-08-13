import { Module } from '@nestjs/common';
import { ShoppingSessionsService } from './shopping-sessions.service';
import { ShoppingSessionsController } from './shopping-sessions.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [ShoppingSessionsController],
  providers: [ShoppingSessionsService, PrismaService],
})
export class ShoppingSessionsModule {}
