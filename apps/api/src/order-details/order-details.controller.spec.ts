import { Test, TestingModule } from '@nestjs/testing';
import { OrderDetailsController } from './order-details.controller';
import { OrderDetailsService } from './order-details.service';

describe('OrderDetailsController', () => {
  let controller: OrderDetailsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrderDetailsController],
      providers: [OrderDetailsService],
    }).compile();

    controller = module.get<OrderDetailsController>(OrderDetailsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
