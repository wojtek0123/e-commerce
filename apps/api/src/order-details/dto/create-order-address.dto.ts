import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class CreateOrderAddressDto {
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

  @ApiProperty({ type: String, required: false })
  @IsString()
  @IsOptional()
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
