import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class Country {
  @ApiProperty({ readOnly: true, type: Number })
  @IsNumber()
  id: number;

  @ApiProperty({ type: String })
  @IsString()
  code: string;

  @ApiProperty({ type: String })
  @IsString()
  name: string;
}
