import { ApiCreatedResponse, ApiProperty } from '@nestjs/swagger';
import { Tag } from '@prisma/client';
import {
  IsArray,
  IsDate,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  IsStrongPassword,
} from 'class-validator';

export class CreateBookDto {
  @ApiProperty({ type: String })
  @IsString()
  title: string;

  @ApiProperty({ type: String, required: false })
  @IsString()
  @IsOptional()
  coverImage?: string;

  @ApiProperty({ type: String, required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ type: String, required: false })
  @IsString()
  @IsOptional()
  language?: string;

  @ApiProperty({ type: Number, required: false })
  @IsNumber()
  @IsOptional()
  pages?: number;

  @ApiProperty({ type: Number })
  @IsNumber({
    maxDecimalPlaces: 2,
  })
  price: number;

  @ApiProperty({ type: String, required: false })
  @IsDate()
  @IsOptional()
  publishedDate: string;

  @ApiProperty({ type: Number, required: false })
  @IsNumber()
  @IsOptional()
  publisherId?: number;

  @ApiProperty({ type: Number })
  @IsNumber()
  categoryId: number;

  @ApiProperty({ type: Number, required: false })
  @IsOptional()
  @IsNumber()
  quantity: number;

  @ApiProperty({ enum: Tag, required: false })
  @IsOptional()
  @IsEnum(Tag)
  tag: Tag;

  @ApiProperty({ type: Number, isArray: true })
  @IsArray()
  authorsId: number[];

  @ApiProperty({ type: String, required: false })
  @IsString()
  @IsOptional()
  publisherName: string;
}
