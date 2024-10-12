import { ApiProperty } from '@nestjs/swagger';
import { OrderAddress, PaymentMethod } from '@prisma/client';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { CreateOrderAddressDto } from './create-order-address.dto';

export class CreateOrderDetailDto {
  @ApiProperty({ type: String })
  @IsString()
  shippingMethodId: string;

  @ApiProperty({ type: CreateOrderAddressDto })
  @IsOptional()
  orderAddress: OrderAddress;

  @ApiProperty({ enum: PaymentMethod })
  @IsEnum(PaymentMethod)
  paymentMethod: PaymentMethod;
}
