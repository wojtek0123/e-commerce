import { ApiProperty } from '@nestjs/swagger';
import { Tag } from '@prisma/client';
import {
  IsArray,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
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
  coverImagePath?: string;

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
  // @IsDate()
  @IsOptional()
  publishedDate: string;

  @ApiProperty({ type: String, required: false })
  @IsString()
  @IsOptional()
  publisherId?: string;

  @ApiProperty({ type: String })
  @IsString()
  categoryId: string;

  @ApiProperty({ type: Number, required: false })
  @IsOptional()
  @IsNumber()
  quantity: number;

  @ApiProperty({ enum: Tag, required: false })
  @IsOptional()
  @IsEnum(Tag)
  tag: Tag;

  @ApiProperty({ type: String, isArray: true })
  @IsArray()
  authorsId: string[];

  @ApiProperty({ type: String, required: false })
  @IsString()
  @IsOptional()
  publisherName: string;
}
