import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class UserAddressCreateDto {
  @ApiProperty({ type: String })
  @IsString()
  firstName: string;

  @ApiProperty({ type: String })
  @IsString()
  lastName: string;

  @ApiProperty({ type: String })
  @IsString()
  phone: string;

  @ApiProperty({ type: String })
  @IsString()
  city: string;

  @ApiProperty({ type: String })
  @IsString()
  street: string;

  @ApiProperty({ type: String })
  @IsString()
  houseNumber: string;

  @ApiProperty({ type: String })
  @IsString()
  homeNumber: string;

  @ApiProperty({ type: String })
  @IsString()
  postcode: string;

  @ApiProperty({ type: String })
  @IsString()
  countryId: string;
}
