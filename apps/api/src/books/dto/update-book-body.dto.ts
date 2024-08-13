import { ApiPropertyOptional } from '@nestjs/swagger';
import { $Enums, Prisma } from '@prisma/client';
import { IsString } from 'class-validator';

export class UpdateBookBodyDto implements Prisma.BookUpdateInput {
  @ApiPropertyOptional()
  @IsString()
  title?: string | Prisma.StringFieldUpdateOperationsInput;

  @ApiPropertyOptional()
  tag?: Prisma.NullableEnumTagFieldUpdateOperationsInput | $Enums.Tag;

  @ApiPropertyOptional()
  price?: number | Prisma.FloatFieldUpdateOperationsInput;

  @ApiPropertyOptional()
  description?: string | Prisma.NullableStringFieldUpdateOperationsInput;

  @ApiPropertyOptional()
  category?: Prisma.CategoryUpdateOneRequiredWithoutBooksNestedInput;

  @ApiPropertyOptional()
  publisher?: Prisma.PublisherUpdateOneWithoutBooksNestedInput;

  @ApiPropertyOptional()
  coverImage?: string | Prisma.NullableStringFieldUpdateOperationsInput;

  @ApiPropertyOptional()
  publishingDate?:
    | string
    | Prisma.NullableDateTimeFieldUpdateOperationsInput
    | Date;

  @ApiPropertyOptional()
  authors?: Prisma.BookAuthorUpdateManyWithoutBookNestedInput;

  @ApiPropertyOptional()
  language?: string | Prisma.NullableStringFieldUpdateOperationsInput;

  @ApiPropertyOptional()
  numberPages?: number | Prisma.NullableIntFieldUpdateOperationsInput;
}
