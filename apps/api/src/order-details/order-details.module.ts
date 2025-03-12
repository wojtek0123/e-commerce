import { Module } from '@nestjs/common';
import { OrderDetailsService } from './order-details.service';
import { OrderDetailsController } from './order-details.controller';
import { PrismaService } from '../prisma/prisma.service';
import { EventsGateway } from '../app/gateways/events.gateway';

@Module({
  controllers: [OrderDetailsController],
  providers: [OrderDetailsService, PrismaService, EventsGateway],
})
export class OrderDetailsModule {}
