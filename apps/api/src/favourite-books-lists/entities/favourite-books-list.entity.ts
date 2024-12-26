import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../users/entities/user.entity';
import { BookEntity } from '../../books/entities/book.entity';

export class FavouriteBooksList {
  @ApiProperty({ readOnly: true, type: String })
  id: string;

  @ApiProperty({ type: String })
  userId: string;

  @ApiProperty({ type: User })
  user: User;

  @ApiProperty({ type: BookEntity, isArray: true })
  books: BookEntity[];

  @ApiProperty({ type: String })
  createdAt: Date;

  @ApiProperty({ type: String })
  updatedAt: Date;
}
