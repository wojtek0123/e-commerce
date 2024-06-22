import { ApiProperty } from '@nestjs/swagger';
import { UserAddressEntity } from '../../user-addresses/entities/user-addresses.entity';
import { ShippingMethod } from '../../shipping-methods/entities/shipping-method.entity';

export class OrderDetail {
  @ApiProperty({ readOnly: true, type: Number })
  id: number;

  @ApiProperty({ type: Number })
  total: number;

  @ApiProperty({ type: String })
  createdAt: Date;

  @ApiProperty({ type: String })
  updatedAt: Date;

  @ApiProperty({ type: Number })
  paymentDetailId: number;

  @ApiProperty({ type: UserAddressEntity })
  userAddress: UserAddressEntity;

  @ApiProperty({ type: ShippingMethod })
  shippingMethod: ShippingMethod;
}
