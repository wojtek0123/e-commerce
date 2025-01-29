import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../users/entities/user.entity';
import { BookEntity } from '../../books/entities/book.entity';

export class BookReview {
  @ApiProperty({ type: String })
  id: string;

  @ApiProperty({ type: Number })
  rating: number;

  @ApiProperty({ type: String })
  name: string;

  @ApiProperty({ type: String, required: false })
  message?: string;

  @ApiProperty({ type: String })
  userId: string;

  @ApiProperty({ type: User })
  user: User;

  @ApiProperty({ type: String })
  bookId: string;

  @ApiProperty({ type: BookEntity })
  book: BookEntity;

  @ApiProperty({ type: String })
  createdAt: string;

  @ApiProperty({ type: String })
  updatedAt: string;
}
