import { PartialType } from '@nestjs/mapped-types';
import { CreateFavouriteBooksListDto } from './create-favourite-books-list.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UpdateFavouriteBooksListDto extends PartialType(
  CreateFavouriteBooksListDto,
) {
  @ApiProperty({ type: String })
  @IsString()
  bookId: string;
}
