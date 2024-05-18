import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';
import { BookEntity } from '../../books/entities/book.entity';
import { UserDto } from '../../users/dto/user.dto';

export class CreateCartItemDto {
  @ApiProperty({ type: Number })
  @IsNumber()
  userId: UserDto['id'];

  @ApiProperty({ type: Number })
  @IsNumber()
  bookId: BookEntity['id'];

  @ApiProperty({ type: Number })
  @IsNumber()
  quantity: number;
}
