import { Module } from '@nestjs/common';
import { InventoriesService } from './inventories.service';
import { InventoriesController } from './inventories.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [InventoriesController],
  providers: [InventoriesService, PrismaService],
})
export class InventoriesModule {}
