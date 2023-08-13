import { ApiProperty } from '@nestjs/swagger';
import { CartItem } from '../../cart-items/entities/cart-item.entity';
import { User } from '../../users/entities/user.entity';

export class ShoppingSession {
  @ApiProperty({
    type: 'integer',
    format: 'int32',
    required: false,
  })
  id: number;

  @ApiProperty({
    type: 'number',
    format: 'double',
    required: false,
  })
  total: number;

  @ApiProperty({
    type: 'string',
    format: 'date-time',
    required: false,
  })
  createdAt: Date;

  @ApiProperty({
    required: false,
  })
  user?: User;

  @ApiProperty({
    required: false,
  })
  userId: string;

  @ApiProperty({
    isArray: true,
    required: false,
  })
  CartItem?: CartItem[];
}
