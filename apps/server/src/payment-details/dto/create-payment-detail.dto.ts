import { ApiProperty } from '@nestjs/swagger';

export class CreatePaymentDetailDto {
  @ApiProperty({
    type: 'integer',
    format: 'int32',
  })
  amount: number;

  @ApiProperty()
  provider: string;

  @ApiProperty()
  status: string;
}
