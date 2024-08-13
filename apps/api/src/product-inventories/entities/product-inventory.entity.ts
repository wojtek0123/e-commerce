import { ApiProperty } from '@nestjs/swagger';
import { ProductInventory } from '@prisma/client';

export class ProductInventoryEntity implements ProductInventory {
  @ApiProperty({ readOnly: true, type: Number })
  id: number;

  @ApiProperty({ type: Number })
  quantity: number;

  @ApiProperty({ type: String })
  createdAt: Date;

  @ApiProperty({ type: String })
  updatedAt: Date;
}
