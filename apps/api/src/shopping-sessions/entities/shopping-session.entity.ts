import { ApiProperty } from '@nestjs/swagger';
import { ShoppingSession } from '@prisma/client';
import { CartItemEntity } from '../../cart-items/entities/cart-item.entity';

export class ShoppingSessionEntity implements ShoppingSession {
  @ApiProperty({ readOnly: true, type: String })
  id: string;

  @ApiProperty({ type: String })
  createdAt: Date;

  @ApiProperty({ type: String })
  updatedAt: Date;

  @ApiProperty({ type: String })
  userId: string;

  @ApiProperty({ type: Number })
  total: number;

  @ApiProperty({ type: CartItemEntity, isArray: true })
  cartItems: CartItemEntity[];
}
