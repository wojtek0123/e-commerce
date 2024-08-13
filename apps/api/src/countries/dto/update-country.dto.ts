import { PartialType } from '@nestjs/mapped-types';
import { CreateCountryDto } from './create-country.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UpdateCountryDto extends PartialType(CreateCountryDto) {
  @ApiProperty({ required: false, type: String })
  @IsString()
  code: string;

  @ApiProperty({ required: false, type: String })
  @IsString()
  name: string;
}
