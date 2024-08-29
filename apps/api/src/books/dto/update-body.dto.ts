import { $Enums, Prisma, Tag } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateBookBodyDto implements Prisma.BookUpdateInput {
  @ApiProperty({ type: String, required: false })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({ type: String, required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ type: Number, required: false })
  @IsOptional()
  @IsNumber()
  price?: number;

  @ApiProperty({ type: String, required: false })
  @IsOptional()
  @IsString()
  language?: string;

  @ApiProperty({ type: Number, required: false })
  @IsOptional()
  @IsNumber()
  pages?: number;

  @ApiProperty({ type: String, required: false })
  @IsOptional()
  @IsString()
  publishingDate?: string;

  @ApiProperty({ enum: Tag, required: false })
  @IsOptional()
  @IsEnum(Tag)
  tag?: $Enums.Tag;

  @ApiProperty({ type: Number, required: false })
  @IsOptional()
  categoryId?: number;

  @ApiProperty({ type: String, required: false })
  @IsOptional()
  @IsString()
  coverImage?: string;
}
