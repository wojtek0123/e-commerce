import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../users/entities/user.entity';
import { Book } from '../../books/entities/book.entity';

export class FavouriteBooksList {
  @ApiProperty({ readOnly: true, type: String })
  id: string;

  @ApiProperty({ type: String })
  userId: string;

  @ApiProperty({ type: User })
  user: User;

  @ApiProperty({ type: Book, isArray: true })
  books: Book[];

  @ApiProperty({ type: String })
  createdAt: Date;

  @ApiProperty({ type: String })
  updatedAt: Date;
}
