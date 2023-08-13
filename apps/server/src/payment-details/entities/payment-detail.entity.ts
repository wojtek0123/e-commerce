import { ApiProperty } from '@nestjs/swagger';
import { OrderDetail } from '../../order-details/entities/order-detail.entity';

export class PaymentDetail {
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
  amount: number;
  @ApiProperty({
    required: false,
  })
  provider: string;
  @ApiProperty({
    required: false,
  })
  status: string;
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
  OrderDetails?: OrderDetail | null;
}
