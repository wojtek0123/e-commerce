import { ApiProperty } from '@nestjs/swagger';
import { BookEntity } from './book.entity';

export class Books {
  @ApiProperty({ type: BookEntity, isArray: true })
  items: BookEntity[];

  @ApiProperty({ type: Number })
  total: number;

  @ApiProperty({ type: Number })
  count: number;

  @ApiProperty({ type: Number })
  page: number;
}
