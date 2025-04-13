import { ApiProperty } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
import { IsString } from 'class-validator';

export class UserAddressUpdateDto implements Prisma.UserAddressUpdateInput {
  @ApiProperty({ required: false, type: String })
  @IsString()
  postcode?: string;

  @ApiProperty({ required: false, type: String })
  @IsString()
  street?: string;

  @ApiProperty({ required: false, type: String })
  @IsString()
  city?: string;

  @ApiProperty({ required: false, type: String })
  @IsString()
  homeNumber?: string;

  @ApiProperty({ required: false, type: String })
  @IsString()
  houseNumber?: string;

  @ApiProperty({ required: false, type: String })
  @IsString()
  countryId?: string;
}
