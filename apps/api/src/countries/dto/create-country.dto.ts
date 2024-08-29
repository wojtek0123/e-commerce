import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateCountryDto {
  @ApiProperty({ type: String })
  @IsString()
  code: string;

  @ApiProperty({ type: String })
  @IsString()
  name: string;
}
