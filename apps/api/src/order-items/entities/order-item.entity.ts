import { ApiProperty } from '@nestjs/swagger';
import { Book } from '../../books/entities/book.entity';

export class OrderItem {
  @ApiProperty({ type: String, readOnly: true })
  id: string;

  @ApiProperty({ type: Book })
  book: Book;

  @ApiProperty({ type: Number })
  quantity: number;

  @ApiProperty({ type: String })
  createdAt: Date;

  @ApiProperty({ type: String })
  updatedAt: Date;
}
