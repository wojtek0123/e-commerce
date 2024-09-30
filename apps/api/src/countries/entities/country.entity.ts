import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class Country {
  @ApiProperty({ readOnly: true, type: String })
  @IsString()
  id: string;

  @ApiProperty({ type: String })
  @IsString()
  code: string;

  @ApiProperty({ type: String })
  @IsString()
  name: string;
}
