import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class CreateOrderItemDto {
  @ApiProperty({ type: Number, required: true })
  @IsNumber()
  quantity: number;

  @ApiProperty({ type: Number, required: true })
  @IsNumber()
  bookId: number;

  @ApiProperty({ type: Number, required: true })
  @IsNumber()
  orderDetailsId: number;
}
