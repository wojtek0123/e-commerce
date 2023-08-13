import { ApiProperty } from '@nestjs/swagger';

export class CreateShoppingSessionDto {
  @ApiProperty({
    type: 'number',
    format: 'double',
  })
  total: number;
}
