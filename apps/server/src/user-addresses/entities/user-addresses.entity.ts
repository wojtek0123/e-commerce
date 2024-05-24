import { ApiProperty } from '@nestjs/swagger';
import { UserAddress } from '@prisma/client';
import { UserDto } from '../../users/dto/user.dto';

export class UserAddressEntity implements UserAddress {
  @ApiProperty({ readOnly: true, type: Number })
  id: number;

  @ApiProperty({ type: String })
  firstName: string;

  @ApiProperty({ type: String })
  surname: string;

  @ApiProperty({ type: String })
  phone: string;

  @ApiProperty({ type: String })
  city: string;

  @ApiProperty({ type: String })
  street: string;

  @ApiProperty({ type: String })
  homeNumber: string;

  @ApiProperty({ type: String })
  houseNumber: string;

  @ApiProperty({ type: String })
  postcode: string;

  @ApiProperty({ type: UserDto })
  user: UserDto;

  @ApiProperty({ type: Number })
  userId: number;
}
