import { ApiProperty } from '@nestjs/swagger';
import { ProductInventory } from '@prisma/client';
import { BookEntity } from '../../books/entities/book.entity';

export class ProductInventoryEntity implements ProductInventory {
  @ApiProperty({ readOnly: true, type: String })
  id: string;

  @ApiProperty({ type: Number })
  quantity: number;

  @ApiProperty({ type: String })
  createdAt: Date;

  @ApiProperty({ type: String })
  updatedAt: Date;

  @ApiProperty({ type: BookEntity })
  book: BookEntity;
}
