import { ApiProperty } from '@nestjs/swagger';
import { CartItem } from '@prisma/client';
import { IsNumber, IsString } from 'class-validator';

export class CartItemEntity implements CartItem {
  @ApiProperty({ readOnly: true, type: Number })
  @IsNumber()
  id: number;

  @ApiProperty({ type: Number })
  @IsNumber()
  quantity: number;

  @ApiProperty({ type: Number })
  @IsNumber()
  userId: number;

  @ApiProperty({ type: Number })
  @IsNumber()
  bookId: number;

  @ApiProperty({ type: String })
  @IsString()
  createdAt: Date;

  @ApiProperty({ type: String })
  @IsString()
  updatedAt: Date;
}
