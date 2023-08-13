import { Module } from '@nestjs/common';
import { CartItemsService } from './cart-items.service';
import { CartItemsController } from './cart-items.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  controllers: [CartItemsController],
  providers: [CartItemsService],
  imports: [PrismaModule],
})
export class CartItemsModule {}
