import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsDate,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { Tag } from '@prisma/client';

export class GetBooksBodyDto {
  @ApiProperty({ required: false, isArray: true, enum: Tag })
  @IsOptional()
  tagsIn?: string;

  @ApiProperty({ required: false, isArray: true, type: String })
  @IsOptional()
  @IsArray()
  categoryNamesIn?: string;

  @ApiProperty({ required: false, type: String })
  @IsOptional()
  @IsString()
  titleLike?: string;

  @ApiProperty({ required: false, type: String })
  @IsOptional()
  @IsDate()
  publishDateFrom?: Date;

  @ApiProperty({ required: false, type: String })
  @IsOptional()
  @IsDate()
  publishDateTo?: Date;

  @ApiProperty({ required: false, isArray: true, type: Number })
  @IsOptional()
  publisherIdsIn?: number;

  @ApiProperty({ required: false, type: Number })
  @IsOptional()
  @IsNumber()
  priceFrom?: number;

  @ApiProperty({ required: false, type: Number })
  @IsOptional()
  @IsNumber()
  priceTo?: number;

  @ApiProperty({ required: false, type: String })
  @IsOptional()
  @IsString()
  authorLike?: string;

  @ApiProperty({ required: false, isArray: true, type: String })
  @IsOptional()
  @IsArray()
  authorNamesIn?: string;

  @ApiProperty({ required: false, type: Number, default: 20 })
  @IsOptional()
  size = 20;

  @ApiProperty({ required: false, type: Number, default: 1 })
  @IsOptional()
  page = 1;
}
