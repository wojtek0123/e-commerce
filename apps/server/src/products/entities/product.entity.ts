import { Prisma } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { ProductCategory } from '../../product-categories/entities/product-category.entity';
import { ProductInventory } from '../../product-inventories/entities/product-inventory.entity';
import { Discount } from '../../discounts/entities/discount.entity';
import { CartItem } from '../../cart-items/entities/cart-item.entity';
import { OrderItem } from '../../order-items/entities/order-item.entity';

export class Product {
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
  price: Prisma.Decimal;

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
  productCategory?: ProductCategory | null;

  @ApiProperty({
    type: 'integer',
    format: 'int32',
    required: false,
  })
  productCategoryId: number | null;

  @ApiProperty({
    required: false,
    nullable: true,
  })
  productInventory?: ProductInventory | null;

  @ApiProperty({
    type: 'integer',
    format: 'int32',
    required: false,
  })
  productInventoryId: number | null;

  @ApiProperty({
    required: false,
  })
  discount?: Discount;

  @ApiProperty({
    type: 'integer',
    format: 'int32',
    required: false,
  })
  discountId: number;

  @ApiProperty({
    required: false,
    nullable: true,
  })
  cartItem?: CartItem | null;

  @ApiProperty({
    required: false,
    nullable: true,
  })
  orderItems?: OrderItem | null;
}
