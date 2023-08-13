import { Test, TestingModule } from '@nestjs/testing';
import { PaymentDetailsController } from './payment-details.controller';
import { PaymentDetailsService } from './payment-details.service';

describe('PaymentDetailsController', () => {
  let controller: PaymentDetailsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PaymentDetailsController],
      providers: [PaymentDetailsService],
    }).compile();

    controller = module.get<PaymentDetailsController>(PaymentDetailsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
