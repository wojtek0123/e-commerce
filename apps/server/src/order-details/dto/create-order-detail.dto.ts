import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class CreateOrderDetailDto {
  @ApiProperty({ type: Number })
  @IsNumber()
  total: number;

  @ApiProperty({ type: Number })
  @IsNumber()
  paymentDetailsId: number;

  @ApiProperty({ type: Number })
  @IsNumber()
  userAddressId: number;

  @ApiProperty({ type: Number })
  @IsNumber()
  shippingMethodId: number;

  @ApiProperty({ type: Number })
  @IsNumber()
  userId: number;

  @ApiProperty({ type: Number, isArray: true })
  @IsNumber()
  orderItemIds: number;
}
