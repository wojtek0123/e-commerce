import { Module } from '@nestjs/common';
import { ProductInventoriesService } from './product-inventories.service';
import { ProductInventoriesController } from './product-inventories.controller';

@Module({
  controllers: [ProductInventoriesController],
  providers: [ProductInventoriesService]
})
export class ProductInventoriesModule {}
