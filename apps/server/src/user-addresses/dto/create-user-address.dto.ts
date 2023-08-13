import { ApiProperty } from '@nestjs/swagger';

export class CreateUserAddressDto {
  @ApiProperty()
  phone: string;

  @ApiProperty()
  city: string;

  @ApiProperty()
  street: string;

  @ApiProperty()
  houseNumber: string;

  @ApiProperty()
  homeNumber: string;
}
