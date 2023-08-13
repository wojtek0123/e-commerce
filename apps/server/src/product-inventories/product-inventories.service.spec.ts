import { Test, TestingModule } from '@nestjs/testing';
import { ProductInventoriesService } from './product-inventories.service';

describe('ProductInventoriesService', () => {
  let service: ProductInventoriesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProductInventoriesService],
    }).compile();

    service = module.get<ProductInventoriesService>(ProductInventoriesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
