import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsString } from 'class-validator';

export class CategoryDto {
  @ApiProperty({ readOnly: true, type: String })
  @IsString()
  id: string;

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
