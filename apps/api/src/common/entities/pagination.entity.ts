import { ApiProperty } from '@nestjs/swagger';

export class Pagination<Item> {
  @ApiProperty({ type: Number })
  total: number;

  @ApiProperty({ type: Number })
  count: number;

  @ApiProperty({ type: Number })
  page: number;

  @ApiProperty({ type: Object, isArray: true })
  items: Item[];
}
