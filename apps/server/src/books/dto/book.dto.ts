import { ApiProperty } from '@nestjs/swagger';
import { Book } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';

export class BookDto implements Book {
  @ApiProperty({ readOnly: true })
  id: number;

  @ApiProperty()
  title: string;

  @ApiProperty()
  coverImage: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  language: string;

  @ApiProperty()
  numberPages: number;

  @ApiProperty()
  price: Decimal;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  publishingDate: Date;

  @ApiProperty()
  publisherId: number;
}
