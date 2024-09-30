import { ApiProperty } from '@nestjs/swagger';
import { CartItem, ShoppingSession } from '@prisma/client';
import { IsNumber, IsString } from 'class-validator';
import { BookEntity } from '../../books/entities/book.entity';

export class CartItemEntity implements CartItem {
  @ApiProperty({ readOnly: true, type: String })
  @IsString()
  id: string;

  @ApiProperty({ type: Number })
  @IsNumber()
  quantity: number;

  @ApiProperty({ type: Number })
  @IsNumber()
  userId: number;

  @ApiProperty({ type: String })
  @IsString()
  bookId: BookEntity['id'];

  @ApiProperty({ type: String })
  @IsString()
  createdAt: Date;

  @ApiProperty({ type: String })
  @IsString()
  updatedAt: Date;

  @ApiProperty({ type: BookEntity })
  book: BookEntity;

  @ApiProperty({ type: String })
  @IsString()
  shoppingSessionId: ShoppingSession['id'];

  @ApiProperty()
  shoppingSession: string;
}
