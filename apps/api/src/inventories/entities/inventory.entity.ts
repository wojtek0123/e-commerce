import { ApiProperty } from '@nestjs/swagger';
import { Book } from '../../books/entities/book.entity';

export class Inventory {
  @ApiProperty({ readOnly: true, type: String })
  id: string;

  @ApiProperty({ type: Number })
  quantity: number;

  @ApiProperty({ type: String })
  createdAt: Date;

  @ApiProperty({ type: String })
  updatedAt: Date;

  @ApiProperty({ type: String })
  bookId: string;

  @ApiProperty({ type: Book })
  book: Book;
}
