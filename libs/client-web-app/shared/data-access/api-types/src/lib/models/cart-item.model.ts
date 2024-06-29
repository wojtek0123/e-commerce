import { Book } from './book.model';
import { User } from './user.model';

export interface CartItemBase {
  book: Book;
  quantity: number;
}

export interface CartItem extends CartItemBase {
  id: number;
  bookId: Book['id'];
  userId: User['id'];
  createdAt: string;
  updatedAt: string;
}
