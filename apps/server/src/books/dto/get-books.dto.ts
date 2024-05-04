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
  @ApiProperty({ required: false, isArray: true })
  @IsOptional()
  tagsIn: Tag[];

  @ApiProperty({ required: false, isArray: true })
  @IsOptional()
  @IsArray()
  categoryIdsIn: number[];

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  titleLike: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDate()
  publishDateFrom: Date;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDate()
  publishDateTo: Date;

  @ApiProperty({ required: false, isArray: true })
  @IsOptional()
  publisherIdsIn: number[];

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  priceFrom: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  priceTo: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  authorLike: string;

  @ApiProperty({ required: false, isArray: true })
  @IsOptional()
  @IsArray()
  authorIn: string[];
}
