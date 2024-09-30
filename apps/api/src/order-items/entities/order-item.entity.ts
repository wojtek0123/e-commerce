import { ApiProperty } from '@nestjs/swagger';
import { BookEntity } from '../../books/entities/book.entity';

export class OrderItem {
  @ApiProperty({ type: String, readOnly: true })
  id: string;

  @ApiProperty({ type: BookEntity })
  book: BookEntity;

  @ApiProperty({ type: Number })
  quantity: number;

  @ApiProperty({ type: String })
  createdAt: Date;

  @ApiProperty({ type: String })
  updatedAt: Date;
}
