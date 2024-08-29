import { createFeature, createReducer, on } from '@ngrx/store';
import { initialBookState, BookState } from './book.state';
import { bookActions } from './book.actions';

export const bookFeature = createFeature({
  name: 'book',
  reducer: createReducer(
    initialBookState,
    on(
      bookActions.getBook,
      (state, { bookId }): BookState => ({
        ...state,
        bookId,
        loading: true,
      }),
    ),
    on(
      bookActions.getBookSuccess,
      (state, { book }): BookState => ({
        ...state,
        loading: false,
        book,
        availableQuantity: book.productInventory.quantity,
      }),
    ),
    on(bookActions.getBookFailure, (state, { error }) => ({
      ...state,
      loading: false,
      error: error.message,
    })),
  ),
});
