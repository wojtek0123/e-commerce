import { Prisma } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { Product } from '../../products/entities/product.entity';

export class Discount {
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
    type: 'number',
    format: 'double',
    required: false,
  })
  discountPercent: Prisma.Decimal;
  @ApiProperty({
    required: false,
  })
  active: boolean;
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
  Product?: Product[];
}
