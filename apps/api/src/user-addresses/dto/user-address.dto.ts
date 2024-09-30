import { ApiProperty } from '@nestjs/swagger';
import { UserAddress } from '@prisma/client';
import { Country } from '../../countries/entities/country.entity';

export class UserAddressDto implements UserAddress {
  @ApiProperty()
  id: string;

  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;

  @ApiProperty()
  city: string;

  @ApiProperty()
  postcode: string;

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

  @ApiProperty()
  countryId: string;

  @ApiProperty()
  country: Country;
}
