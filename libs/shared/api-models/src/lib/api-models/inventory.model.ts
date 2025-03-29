import { Book } from './book.model';

export interface Inventory {
  id: string;
  quantity: number;
  book: Book;
  updatedAt: string;
  createdAt: string;
}
