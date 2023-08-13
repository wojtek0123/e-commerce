import { Prisma } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class CreateDiscountDto {
  @ApiProperty()
  name: string;
  @ApiProperty()
  description: string;
  @ApiProperty({
    type: 'number',
    format: 'double',
  })
  discountPercent: Prisma.Decimal;
  @ApiProperty()
  active: boolean;
}
