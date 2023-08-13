import { ApiProperty } from '@nestjs/swagger';

export class CreateUserPaymentDto {
  @ApiProperty()
  paymentType: string;

  @ApiProperty()
  provider: string;

  @ApiProperty()
  accountNumber: string;

  @ApiProperty({
    type: 'string',
    format: 'date-time',
  })
  expiry: Date;
}
