import { ApiProperty } from '@nestjs/swagger';
import { Tag } from '@prisma/client';
import { IsDate, IsEnum, IsNumber, IsString } from 'class-validator';

export class BookDto {
  @ApiProperty({ readOnly: true })
  @IsNumber()
  id: number;

  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsString()
  coverImage: string;

  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty()
  @IsString()
  language: string;

  @ApiProperty()
  @IsNumber()
  numberPages: number;

  @ApiProperty()
  @IsNumber({
    maxDecimalPlaces: 2,
  })
  price: number;

  @ApiProperty()
  @IsDate()
  createdAt: Date;

  @ApiProperty()
  @IsDate()
  updatedAt: Date;

  @ApiProperty()
  @IsDate()
  publishingDate: Date;

  @ApiProperty()
  @IsNumber()
  publisherId: number;

  @ApiProperty()
  @IsEnum(Tag)
  tag: Tag;
}
