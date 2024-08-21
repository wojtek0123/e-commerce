import { BookDetails } from '@e-commerce/client-web/shared/data-access';

export const BOOK_NAME = 'Book Page' as const;

export interface BookState {
  book: BookDetails | null;
  bookId: BookDetails['id'] | null;
  availableQuantity: number;
  loading: boolean;
  error: string | string[] | null;
}

export const initialBookState: BookState = {
  bookId: null,
  book: null,
  loading: false,
  error: null,
  availableQuantity: 0,
};
