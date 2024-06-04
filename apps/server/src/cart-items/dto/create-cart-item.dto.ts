import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';
import { BookEntity } from '../../books/entities/book.entity';

export class CreateCartItemDto {
  @ApiProperty({ type: Number })
  @IsNumber()
  bookId: BookEntity['id'];

  @ApiProperty({ type: Number })
  @IsNumber()
  quantity: number;

  @ApiProperty({ type: Number })
  @IsNumber()
  shoppingSessionId: number;
}
