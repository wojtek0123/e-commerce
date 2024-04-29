import { $Enums, Prisma, Tag } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateBookBodyDto implements Prisma.BookUpdateInput {
  @ApiProperty()
  @IsOptional()
  @IsString()
  title?: string | Prisma.StringFieldUpdateOperationsInput | undefined;

  @ApiProperty()
  @IsOptional()
  @IsString()
  description?: string | Prisma.StringFieldUpdateOperationsInput;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  price?: number | Prisma.FloatFieldUpdateOperationsInput;

  @ApiProperty({ isArray: true })
  @IsOptional()
  authors?: Prisma.BookAuthorUpdateManyWithoutBookNestedInput;

  @ApiProperty()
  @IsOptional()
  @IsString()
  language?: string | Prisma.StringFieldUpdateOperationsInput;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  numberPages?: number | Prisma.IntFieldUpdateOperationsInput;

  @ApiProperty()
  @IsOptional()
  @IsString()
  publishingDate?: string | Prisma.DateTimeFieldUpdateOperationsInput | Date;

  @ApiProperty()
  @IsOptional()
  @IsEnum(Tag)
  tag?: Prisma.NullableEnumTagFieldUpdateOperationsInput | $Enums.Tag;

  @ApiProperty()
  @IsOptional()
  category?: Prisma.CategoryUpdateOneRequiredWithoutBooksNestedInput;

  @ApiProperty()
  @IsOptional()
  @IsString()
  coverImage?: string | Prisma.StringFieldUpdateOperationsInput;
}
