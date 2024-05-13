import { ApiProperty } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
import { IsNumber } from 'class-validator';

export class CreateCartItemDto implements Prisma.CartItemCreateInput {
  @ApiProperty()
  user: Prisma.UserCreateNestedOneWithoutCartItemInput;

  @ApiProperty()
  book: Prisma.BookCreateNestedOneWithoutCartItemInput;

  @ApiProperty({ type: Number })
  @IsNumber()
  quantity: number;
}
