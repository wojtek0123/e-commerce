import { ApiProperty } from '@nestjs/swagger';
import { UserAddress } from '../../user-addresses/entities/user-addresses.entity';
import { ShippingMethod } from '../../shipping-methods/entities/shipping-method.entity';
import { Payment } from '../../payments/entities/payment.entity';
import { OrderStatus } from '@prisma/client';
import { OrderItem } from '../../order-items/entities/order-item.entity';

export class OrderDetail {
  @ApiProperty({ readOnly: true, type: Number })
  id: number;

  @ApiProperty({ type: Number })
  total: number;

  @ApiProperty({ enum: OrderStatus })
  status: OrderStatus;

  @ApiProperty({ type: String })
  createdAt: Date;

  @ApiProperty({ type: String })
  updatedAt: Date;

  @ApiProperty({ type: Payment })
  paymentDetails: Payment;

  @ApiProperty({ type: UserAddress })
  userAddress: UserAddress;

  @ApiProperty({ type: ShippingMethod })
  shippingMethod: ShippingMethod;

  @ApiProperty({ type: OrderItem, isArray: true })
  orderItems: OrderItem;
}
