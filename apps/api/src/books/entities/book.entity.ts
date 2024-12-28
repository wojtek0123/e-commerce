import { ApiProperty } from '@nestjs/swagger';
import { $Enums, Book, Tag } from '@prisma/client';
import { IsOptional, IsString } from 'class-validator';
import { AuthorEntity } from '../../authors/enities/author.entity';
import { Category } from '../../categories/entities/category.entity';

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

  @ApiProperty({ type: String })
  publisherId: string;

  @ApiProperty({ type: String })
  categoryId: string;

  @ApiProperty({ required: false, type: String })
  coverImage: string;

  @ApiProperty({ required: false, type: String })
  coverImagePath: string;

  @ApiProperty({ required: false, type: String })
  @IsOptional()
  description: string;

  @ApiProperty({ type: String })
  language: string;

  @ApiProperty({ type: String })
  @IsString()
  id: string;

  @ApiProperty({ enum: Tag, required: false })
  tag: $Enums.Tag;

  @ApiProperty({ type: Number })
  price: number;

  @ApiProperty({ isArray: true, type: AuthorEntity })
  authors: AuthorEntity[];

  @ApiProperty({ type: Category })
  category: Category;

  @ApiProperty({ type: String })
  productInventoryId: string;
}
