import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsDate,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { Tag } from '@prisma/client';

export class GetBooksBodyDto {
  @ApiProperty()
  @IsEnum(Tag)
  @IsOptional()
  tagEquals: Tag;

  @ApiProperty()
  @IsOptional()
  @IsArray()
  categoryIdsIn: number[];

  @ApiProperty()
  @IsOptional()
  @IsString()
  titleLike: string;

  @ApiProperty()
  @IsOptional()
  @IsDate()
  publishDateFrom: Date;

  @ApiProperty()
  @IsOptional()
  @IsDate()
  publishDateTo: Date;

  @ApiProperty()
  @IsOptional()
  publisherIdsIn: number[];

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  priceFrom: number;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  priceTo: number;

  @ApiProperty()
  @IsOptional()
  @IsString()
  authorLike: string;

  @ApiProperty()
  @IsOptional()
  @IsArray()
  authorIn: string[];
}
