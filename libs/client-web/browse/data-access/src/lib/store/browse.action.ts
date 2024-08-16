import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Book, ResponseError } from '@e-commerce/client-web/shared/data-access';
import { BrowseState } from './browse.state';

export const browseActions = createActionGroup({
  source: 'browse',
  events: {
    getBooks: emptyProps(),
    getBooksSuccess: props<{ books: Book[]; count: number; total: number }>(),
    getBooksFailure: props<{ error: ResponseError }>(),

    setSearch: props<{ value: string | null }>(),

    setPage: props<{ page: number }>(),
    setSize: props<{ size: number }>(),

    addBookToCart: props<{ book: Book }>(),
    addBookToCartSuccess: props<{ bookId: Book['id'] }>(),
    addBookToCartFailure: props<{ bookId: Book['id']; error: ResponseError }>(),

    getFilter: props<{
      name: string | null;
      filter: keyof BrowseState['filters'];
    }>(),
    getFilterSuccess: props<{
      items: any[];
      filter: keyof BrowseState['filters'];
    }>(),
    getFilterFailure: props<{ error: ResponseError }>(),

    setSelectedItems: props<{
      selectedItems: any[];
      filter: keyof BrowseState['filters'];
    }>(),
  },
});
