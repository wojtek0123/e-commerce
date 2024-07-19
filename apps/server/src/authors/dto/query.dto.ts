import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional } from 'class-validator';

export class QueryDto {
  @ApiProperty({ type: Number, required: false })
  @IsOptional()
  @IsNumber()
  page?: number;

  @ApiProperty({ type: Number, required: false })
  @IsOptional()
  @IsNumber()
  size?: number;
}
