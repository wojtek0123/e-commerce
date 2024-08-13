import { ApiProperty } from '@nestjs/swagger';
import { CartItem } from '@prisma/client';
import { IsNumber, IsString } from 'class-validator';
import { BookEntity } from '../../books/entities/book.entity';

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

  @ApiProperty({ type: BookEntity })
  book: BookEntity;

  @ApiProperty({ type: Number })
  shoppingSessionId: number;

  @ApiProperty()
  shoppingSession: string;
}
