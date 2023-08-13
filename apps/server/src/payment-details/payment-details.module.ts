import { Module } from '@nestjs/common';
import { PaymentDetailsService } from './payment-details.service';
import { PaymentDetailsController } from './payment-details.controller';

@Module({
  controllers: [PaymentDetailsController],
  providers: [PaymentDetailsService]
})
export class PaymentDetailsModule {}
