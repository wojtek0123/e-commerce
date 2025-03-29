import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';
import { Book } from '../../books/entities/book.entity';

export class CreateCartItemDto {
  @ApiProperty({ type: String })
  @IsString()
  bookId: Book['id'];

  @ApiProperty({ type: Number })
  @IsNumber()
  quantity: number;
}
