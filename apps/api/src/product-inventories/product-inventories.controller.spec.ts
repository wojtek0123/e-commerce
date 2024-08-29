import { Test, TestingModule } from '@nestjs/testing';
import { ProductInventoriesController } from './product-inventories.controller';
import { ProductInventoriesService } from './product-inventories.service';

describe('ProductInventoriesController', () => {
  let controller: ProductInventoriesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductInventoriesController],
      providers: [ProductInventoriesService],
    }).compile();

    controller = module.get<ProductInventoriesController>(ProductInventoriesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
