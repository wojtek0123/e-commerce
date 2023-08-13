import { ApiProperty } from '@nestjs/swagger';
import { Product } from '../../generated/nestjs-dto/product.entity';
import { OrderDetail } from '../../order-details/entities/order-detail.entity';

export class OrderItem {
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
  order?: OrderDetail;
  @ApiProperty({
    type: 'integer',
    format: 'int32',
    required: false,
  })
  orderId: number;
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
