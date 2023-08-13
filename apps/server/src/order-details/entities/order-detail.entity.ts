import { Prisma } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../users/entities/user.entity';
import { PaymentDetail } from '../../payment-details/entities/payment-detail.entity';
import { OrderItem } from '../../order-items/entities/order-item.entity';

export class OrderDetail {
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
  total: Prisma.Decimal;
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
  user?: User;
  @ApiProperty({
    required: false,
  })
  userId: string;
  @ApiProperty({
    required: false,
  })
  paymentDetails?: PaymentDetail;
  @ApiProperty({
    type: 'integer',
    format: 'int32',
    required: false,
  })
  paymentDetailsId: number;
  @ApiProperty({
    isArray: true,
    required: false,
  })
  OrderItems?: OrderItem[];
}
