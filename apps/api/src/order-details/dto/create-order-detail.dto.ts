import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class CreateOrderDetailDto {
  @ApiProperty({ type: Number })
  @IsNumber()
  userAddressId: number;

  @ApiProperty({ type: Number })
  @IsNumber()
  shippingMethodId: number;
}
