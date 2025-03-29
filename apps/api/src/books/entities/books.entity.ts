import { ApiProperty } from '@nestjs/swagger';
import { Book } from './book.entity';

export class Books {
  @ApiProperty({ type: Book, isArray: true })
  items: Book[];

  @ApiProperty({ type: Number })
  total: number;

  @ApiProperty({ type: Number })
  count: number;

  @ApiProperty({ type: Number })
  page: number;
}
