import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';
import { BookEntity } from '../../books/entities/book.entity';

export class CreateCartItemDto {
  @ApiProperty({ type: String })
  @IsString()
  bookId: BookEntity['id'];

  @ApiProperty({ type: Number })
  @IsNumber()
  quantity: number;
}
