import { ApiProperty } from '@nestjs/swagger';
import { $Enums, Book, Tag } from '@prisma/client';
import { IsNumber, IsOptional } from 'class-validator';
import { AuthorEntity } from '../../authors/enities/author.entity';
import { CategoryDto } from '../../categories/dto/category.dto';

export class BookEntity implements Book {
  @ApiProperty({ type: String })
  title: string;

  @ApiProperty({ type: String })
  createdAt: Date;

  @ApiProperty({ required: false, type: String })
  updatedAt: Date;

  @ApiProperty({ required: false, type: String })
  @IsOptional()
  publishedDate: Date;

  @ApiProperty({ type: Number })
  pages: number;

  @ApiProperty({ type: Number })
  publisherId: number;

  @ApiProperty({ type: Number })
  categoryId: number;

  @ApiProperty({ required: false, type: String })
  coverImage: string;

  @ApiProperty({ required: false, type: String })
  @IsOptional()
  description: string;

  @ApiProperty({ type: String })
  language: string;

  @ApiProperty({ type: Number })
  @IsNumber()
  id: number;

  @ApiProperty({ enum: Tag, required: false })
  tag: $Enums.Tag;

  @ApiProperty({ type: Number })
  price: number;

  @ApiProperty({ isArray: true, type: AuthorEntity })
  authors: AuthorEntity[];

  @ApiProperty({ type: CategoryDto })
  category: CategoryDto;

  @ApiProperty({ type: Number })
  productInventoryId: number;
}
