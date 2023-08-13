import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../users/entities/user.entity';

export class UserPayment {
  @ApiProperty({
    type: 'integer',
    format: 'int32',
    required: false,
  })
  id: number;

  @ApiProperty({
    required: false,
  })
  paymentType: string;

  @ApiProperty({
    required: false,
  })
  provider: string;

  @ApiProperty({
    required: false,
  })
  accountNumber: string;

  @ApiProperty({
    type: 'string',
    format: 'date-time',
    required: false,
  })
  expiry: Date;

  @ApiProperty({
    required: false,
  })
  user?: User;

  @ApiProperty({
    required: false,
  })
  userId: string;
}
