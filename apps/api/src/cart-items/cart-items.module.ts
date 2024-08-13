import { Module } from '@nestjs/common';
import { CartItemsService } from './cart-items.service';
import { CartItemsController } from './cart-items.controller';
import { PrismaService } from '../prisma/prisma.service';
import { ShoppingSessionsService } from '../shopping-sessions/shopping-sessions.service';

@Module({
  controllers: [CartItemsController],
  providers: [CartItemsService, PrismaService, ShoppingSessionsService],
})
export class CartItemsModule {}
