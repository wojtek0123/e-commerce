import { ApiProperty } from '@nestjs/swagger';
import { Product } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';

export class ProductDto implements Product {
  @ApiProperty()
  id: number;

  @ApiProperty()
  description: string;

  @ApiProperty()
  image: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  price: Decimal;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
