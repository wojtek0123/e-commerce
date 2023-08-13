import { ApiProperty } from '@nestjs/swagger';
import { Product } from '../../products/entities/product.entity';
import { ShoppingSession } from '../../shopping-sessions/entities/shopping-session.entity';
import { CreateShoppingSessionDto } from '../../shopping-sessions/dto/create-shopping-session.dto';

export class CartItem {
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
  })
  shoppingSession?: CreateShoppingSessionDto;

  @ApiProperty({
    type: 'integer',
    format: 'int32',
    required: false,
  })
  shoppingSessionId: number;

  @ApiProperty({
    required: false,
  })
  product?: Product;

  @ApiProperty({
    type: 'integer',
    format: 'int32',
    required: false,
  })
  productId: number;
}
