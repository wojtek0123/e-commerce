import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateOrderDetailDto {
  @ApiProperty({ type: String })
  @IsString()
  userAddressId: string;

  @ApiProperty({ type: String })
  @IsString()
  shippingMethodId: string;
}
