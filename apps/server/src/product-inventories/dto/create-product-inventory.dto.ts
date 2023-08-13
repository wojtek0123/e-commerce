import { ApiProperty } from '@nestjs/swagger';

export class CreateProductInventoryDto {
  @ApiProperty({
    type: 'integer',
    format: 'int32',
  })
  quantity: number;
}
