import { ApiProperty } from '@nestjs/swagger';

export class ShippingMethod {
  @ApiProperty({ type: Number, readOnly: true })
  id: number;

  @ApiProperty({ type: String })
  name: string;

  @ApiProperty({ type: String })
  createdAt: Date;

  @ApiProperty({ type: String })
  updatedAt: Date;
}
