import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../users/entities/user.entity';
import { Country } from '../../countries/entities/country.entity';

export class OrderAddress {
  @ApiProperty({ readOnly: true, type: String })
  id: string;

  @ApiProperty({ type: String })
  firstName: string;

  @ApiProperty({ type: String })
  lastName: string;

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

  @ApiProperty({ type: User })
  user: User;

  @ApiProperty({ type: String })
  userId: string;

  @ApiProperty({ type: String })
  countryId: string;

  @ApiProperty({ type: Country })
  country: { code: string; name: string };
}
