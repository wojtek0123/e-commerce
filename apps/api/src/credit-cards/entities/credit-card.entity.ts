import { ApiProperty } from '@nestjs/swagger';

export class CreditCard {
  @ApiProperty({ type: String, readOnly: true })
  id: string;

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
