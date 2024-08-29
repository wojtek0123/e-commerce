import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsNumber, IsString } from 'class-validator';

export class CategoryDto {
  @ApiProperty({ readOnly: true, type: Number })
  @IsNumber()
  id: number;

  @ApiProperty({ type: String })
  @IsString()
  name: string;

  @ApiProperty({ type: String })
  @IsDate()
  createdAt: Date;

  @ApiProperty({ type: String })
  @IsDate()
  updatedAt: Date;
}
