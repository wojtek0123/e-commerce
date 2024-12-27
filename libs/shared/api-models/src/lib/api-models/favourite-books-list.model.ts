import { Book } from '../api-models/book.model';

export interface FavouriteBooksList {
  id: string;
  userId: string;
  books: Book[];
}
