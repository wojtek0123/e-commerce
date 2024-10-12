import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateShippingMethodDto {
  @ApiProperty({ type: String })
  @IsString()
  name: string;

  @ApiProperty({ type: Number })
  @IsNumber()
  price: number;

  @ApiProperty({ type: Number, required: false })
  @IsNumber()
  @IsOptional()
  orderDetailsId: number;

  @ApiProperty({ type: String, required: true })
  @IsString()
  deliveryTime: string;
}
