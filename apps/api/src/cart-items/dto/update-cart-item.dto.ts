import { PartialType } from '@nestjs/mapped-types';
import { CreateCartItemDto } from './create-cart-item.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class UpdateCartItemDto extends PartialType(CreateCartItemDto) {
  @ApiProperty({ type: Number })
  @IsNumber()
  quantity: number;
}
