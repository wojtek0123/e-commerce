import { ApiProperty } from '@nestjs/swagger';

export class CreateOrderItemDto {
  @ApiProperty({
    type: 'integer',
    format: 'int32',
  })
  quantity: number;
}
