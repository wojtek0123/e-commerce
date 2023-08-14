import { Module } from '@nestjs/common';
import { OrderDetailsService } from './order-details.service';
import { OrderDetailsController } from './order-details.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  controllers: [OrderDetailsController],
  providers: [OrderDetailsService],
  imports: [PrismaModule],
})
export class OrderDetailsModule {}
