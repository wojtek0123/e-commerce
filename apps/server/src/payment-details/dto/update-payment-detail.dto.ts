import { PartialType } from '@nestjs/mapped-types';
import { CreatePaymentDetailDto } from './create-payment-detail.dto';

export class UpdatePaymentDetailDto extends PartialType(CreatePaymentDetailDto) {}
