import { ApiProperty } from '@nestjs/swagger';
import { PaymentStatus } from '@prisma/client';
import { OrderDetail } from '../../order-details/entities/order-detail.entity';

export class Payment {
  @ApiProperty({ type: String, readOnly: true })
  id: string;

  @ApiProperty({ type: String })
  createdAt: Date;

  @ApiProperty({ type: String })
  updatedAt: Date;

  @ApiProperty({ type: Number })
  amount: number;

  @ApiProperty({ enum: PaymentStatus })
  status: PaymentStatus;

  @ApiProperty({ type: OrderDetail })
  orderDetails: OrderDetail;

  @ApiProperty({ type: String })
  provider: string;
}
