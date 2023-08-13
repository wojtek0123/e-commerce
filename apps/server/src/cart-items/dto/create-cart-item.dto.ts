import { ApiProperty } from '@nestjs/swagger';

export class CreateCartItemDto {
  @ApiProperty({
    type: 'integer',
    format: 'int32',
  })
  quantity: number;
}
