import { ApiProperty } from '@nestjs/swagger';
import { $Enums, Book } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';
import { IsNumber, IsOptional } from 'class-validator';

export class BookEntity implements Book {
  @ApiProperty()
  title: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  @IsOptional()
  publishingDate: Date;

  @ApiProperty()
  numberPages: number;

  @ApiProperty()
  publisherId: number;

  @ApiProperty()
  categoryId: number;

  @ApiProperty()
  coverImage: string;

  @ApiProperty()
  @IsOptional()
  description: string;

  @ApiProperty()
  language: string;

  @ApiProperty()
  @IsNumber()
  id: number;

  @ApiProperty()
  tag: $Enums.Tag;

  @ApiProperty()
  price: number;
}
