import { Module } from '@nestjs/common';
import { ShippingMethodsService } from './shipping-methods.service';
import { ShippingMethodsController } from './shipping-methods.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [ShippingMethodsController],
  providers: [ShippingMethodsService, PrismaService],
})
export class ShippingMethodsModule {}
