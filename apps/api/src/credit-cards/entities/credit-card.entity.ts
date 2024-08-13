import { ApiProperty } from '@nestjs/swagger';

export class CreditCard {
  @ApiProperty({ type: Number, readOnly: true })
  id: number;

  @ApiProperty({ type: String })
  number: string;

  // @ApiProperty({ type: String })
  // securityCode: string;
  //
  // @ApiProperty({ type: String })
  // expirationDate: Date;

  @ApiProperty({ type: String })
  createdAt: Date;

  @ApiProperty({ type: String })
  updatedAt: Date;
}
