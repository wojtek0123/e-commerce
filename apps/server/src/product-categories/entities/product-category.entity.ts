import { ApiProperty } from '@nestjs/swagger';
import { Product } from '../../products/entities/product.entity';

export class ProductCategory {
  @ApiProperty({
    type: 'integer',
    format: 'int32',
    required: false,
  })
  id: number;
  @ApiProperty({
    required: false,
  })
  name: string;
  @ApiProperty({
    required: false,
  })
  description: string;
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
  @ApiProperty({
    isArray: true,
    required: false,
  })
  product?: Product[];
}
