import { ApiProperty } from '@nestjs/swagger';
import { UserAddress } from '@prisma/client';

export class UserAddressDto implements UserAddress {
  @ApiProperty()
  id: string;

  @ApiProperty()
  firstName: string;

  @ApiProperty()
  surname: string;

  @ApiProperty()
  city: string;

  @ApiProperty()
  homeNumber: string;

  @ApiProperty()
  houseNumber: string;

  @ApiProperty()
  phone: string;

  @ApiProperty()
  street: string;

  @ApiProperty()
  userId: string;
}
