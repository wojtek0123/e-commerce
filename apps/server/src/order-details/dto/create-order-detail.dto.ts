import { ApiProperty } from '@nestjs/swagger';

export class CreateOrderDetailDto {
  @ApiProperty({
    type: 'number',
    format: 'double',
  })
  total: number;
}
