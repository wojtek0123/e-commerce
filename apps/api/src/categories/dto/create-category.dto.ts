import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({ type: String, example: 'Action' })
  @IsString()
  name: string;
}
