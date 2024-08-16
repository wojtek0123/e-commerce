import { createFeature, createReducer, on } from '@ngrx/store';
import { BrowseState, initialBrowseState } from './browse.state';
import { browseActions } from './browse.action';

export const browseFeature = createFeature({
  name: 'browse',
  reducer: createReducer(
    initialBrowseState,
    on(
      browseActions.getBooks,
      (state): BrowseState => ({
        ...state,
        loading: true,
        error: null,
      }),
    ),
    on(
      browseActions.getBooksSuccess,
      (state, { books, count, total }): BrowseState => ({
        ...state,
        books,
        count,
        total,
        loading: false,
      }),
    ),
    on(
      browseActions.getBooksFailure,
      (state, { error }): BrowseState => ({
        ...state,
        loading: false,
        error: error.message,
      }),
    ),
    on(
      browseActions.setSearch,
      (state, { value }): BrowseState => ({
        ...state,
        search: value,
        loading: true,
      }),
    ),
    on(
      browseActions.setPage,
      (state, { page }): BrowseState => ({
        ...state,
        page,
        loading: true,
      }),
    ),
    on(
      browseActions.setSize,
      (state, { size }): BrowseState => ({
        ...state,
        size,
        loading: true,
      }),
    ),
    on(
      browseActions.addBookToCart,
      (state, { book }): BrowseState => ({
        ...state,
        pendingBookIds: [...state.pendingBookIds, book.id],
      }),
    ),
    on(
      browseActions.addBookToCartSuccess,
      browseActions.addBookToCartFailure,
      (state, { bookId }) => ({
        ...state,
        pendingBookIds: state.pendingBookIds.filter((id) => id !== bookId),
      }),
    ),
    on(browseActions.getFilterSuccess, (state, { items, filter }) => ({
      ...state,
      filters: {
        ...state.filters,
        [filter]: {
          ...state.filters[filter],
          items,
        },
      },
    })),
    on(browseActions.setSelectedItems, (state, { selectedItems, filter }) => ({
      ...state,
      loading: true,
      filters: {
        ...state.filters,
        [filter]: {
          ...state.filters[filter],
          selectedItems,
        },
      },
    })),
  ),
});
