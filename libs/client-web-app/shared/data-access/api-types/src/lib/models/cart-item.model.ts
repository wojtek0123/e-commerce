import { Book } from './book.model';
import { User } from './user.model';

export interface CartItem {
  id: number;
  bookId: Book['id'];
  userId: User['id'];
  book: Book;
  quantity: number;
  createdAt: string;
  updatedAt: string;
}
