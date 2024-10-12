import { ApiProperty } from '@nestjs/swagger';

export class ShippingMethod {
  @ApiProperty({ type: String, readOnly: true })
  id: string;

  @ApiProperty({ type: String })
  name: string;

  @ApiProperty({ type: String })
  deliveryTime: string;

  @ApiProperty({ type: String })
  createdAt: Date;

  @ApiProperty({ type: String })
  updatedAt: Date;
}
