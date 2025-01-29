import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, IsUUID } from 'class-validator';

export class CreateBookReviewDto {
  @ApiProperty({ type: String })
  @IsString()
  @IsUUID()
  bookId: string;

  @ApiProperty({ type: Number })
  @IsNumber()
  rating: number;

  @ApiProperty({ type: String })
  @IsString()
  name: string;

  @ApiProperty({ type: String, required: false })
  @IsString()
  message: string;
}
