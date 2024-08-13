import { Test, TestingModule } from '@nestjs/testing';
import { ShippingMethodsController } from './shipping-methods.controller';
import { ShippingMethodsService } from './shipping-methods.service';

describe('ShippingMethodsController', () => {
  let controller: ShippingMethodsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ShippingMethodsController],
      providers: [ShippingMethodsService],
    }).compile();

    controller = module.get<ShippingMethodsController>(ShippingMethodsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
