import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../users/entities/user.entity';

export class UserAddress {
  @ApiProperty({
    required: false,
  })
  id: string;

  @ApiProperty({
    required: false,
  })
  phone: string;

  @ApiProperty({
    required: false,
  })
  city: string;

  @ApiProperty({
    required: false,
  })
  street: string;

  @ApiProperty({
    required: false,
  })
  houseNumber: string;

  @ApiProperty({
    required: false,
  })
  homeNumber: string;

  @ApiProperty({
    required: false,
  })
  user?: User;

  @ApiProperty({
    required: false,
  })
  userId: string;
}
