import { ApiProperty } from '@nestjs/swagger';
import { Product } from '../../products/entities/product.entity';

export class ProductInventory {
  @ApiProperty({
    type: 'integer',
    format: 'int32',
    required: false,
  })
  id: number;

  @ApiProperty({
    type: 'integer',
    format: 'int32',
    required: false,
  })
  quantity: number;

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
    required: false,
    nullable: true,
  })
  product?: Product | null;
}
