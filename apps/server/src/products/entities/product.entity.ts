import { ApiProperty } from '@nestjs/swagger';

export class Product {
  @ApiProperty({
    type: 'integer',
    format: 'int32',
    required: true,
  })
  id: number;

  @ApiProperty({
    required: true,
  })
  name: string;

  @ApiProperty({
    required: true,
  })
  description: string;

  @ApiProperty({
    type: 'number',
    format: 'double',
    required: true,
  })
  price: number;

  @ApiProperty({
    type: 'string',
    required: true,
  })
  image: string;

  @ApiProperty({
    type: 'string',
    format: 'date-time',
    required: false,
  })
  createdAt: Date;

  @ApiProperty({
    type: 'string',
    format: 'date-time',
    required: false,
  })
  updatedAt: Date;
}
