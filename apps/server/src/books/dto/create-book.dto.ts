import { ApiProperty } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
import { IsDate, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateBook implements Prisma.BookCreateInput {
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
  @IsDate()
  @IsOptional()
  publishingDate: string;

  @ApiProperty()
  @IsNumber()
  publisher?: Prisma.PublisherCreateNestedOneWithoutBooksInput;

  @ApiProperty()
  category: Prisma.CategoryCreateNestedOneWithoutBooksInput;

  @ApiProperty()
  productInventory: Prisma.ProductInventoryCreateNestedOneWithoutBookInput;
}
