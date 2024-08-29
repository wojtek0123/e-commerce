import { Module } from '@nestjs/common';
import { OrderDetailsService } from './order-details.service';
import { OrderDetailsController } from './order-details.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [OrderDetailsController],
  providers: [OrderDetailsService, PrismaService],
})
export class OrderDetailsModule {}
