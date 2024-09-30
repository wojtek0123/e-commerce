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
        books: [],
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
    on(
      browseActions.setSelectedItems,
      (state, { selectedItems, filter, activeFitler }): BrowseState => {
        return {
          ...state,
          loading: true,
          page: 1,
          activeFilters: state.activeFilters.find(
            (filter) => filter.id === activeFitler.id,
          )
            ? state.activeFilters.filter(
                (filter) => filter.id !== activeFitler.id,
              )
            : [...state.activeFilters, activeFitler],
          filters: {
            ...state.filters,
            [filter]: {
              ...state.filters[filter],
              selectedItems,
            },
          },
        };
      },
    ),
    on(browseActions.setPrice, (state, { value, key }): BrowseState => {
      const activeFilters = state.activeFilters.filter(
        ({ id }) => id !== `price_${key}`,
      );

      return {
        ...state,
        page: 1,
        activeFilters:
          value === null
            ? [...activeFilters]
            : [
                ...activeFilters,
                {
                  id: `price_${key}`,
                  name: value.toString(),
                  label: `price ${key}`,
                },
              ],
        filters: {
          ...state.filters,
          price: {
            ...state.filters.price,
            [key]: value,
          },
        },
      };
    }),
    on(
      browseActions.removeActiveFilter,
      (state, { activeFilterId }): BrowseState => {
        const [filter, itemId] = activeFilterId.split('_') as [
          keyof BrowseState['filters'],
          string,
        ];

        if (filter === 'price') {
          return {
            ...state,
            page: 1,
            loading: true,
            activeFilters: state.activeFilters.filter(
              ({ id }) => id !== activeFilterId,
            ),
            filters: {
              ...state.filters,
              [filter]: {
                ...state.filters?.[filter],
                [itemId]: null,
              },
            },
          };
        }

        return {
          ...state,
          page: 1,
          loading: true,
          activeFilters: state.activeFilters.filter(
            ({ id }) => id !== activeFilterId,
          ),
          filters: {
            ...state.filters,
            [filter]: {
              ...state.filters?.[filter],
              selectedItems:
                filter === 'tag'
                  ? state.filters[filter].selectedItems.filter(
                      (item) => item !== itemId,
                    )
                  : state.filters[filter].selectedItems.filter(
                      ({ id }) => id !== itemId,
                    ),
            },
          },
        };
      },
    ),
    on(
      browseActions.removeActiveFilters,
      (state): BrowseState => ({
        ...state,
        page: 1,
        activeFilters: [],
        filters: {
          category: {
            ...state.filters.category,
            selectedItems: [],
          },
          tag: {
            ...state.filters.tag,
            selectedItems: [],
          },
          author: {
            ...state.filters.author,
            selectedItems: [],
          },
          price: {
            min: null,
            max: null,
          },
        },
      }),
    ),
    on(
      browseActions.clearFilterSelectedItems,
      (state, { filter }): BrowseState => {
        if (filter === 'price') {
          return {
            ...state,
            page: 1,
            loading: true,
            activeFilters: state.activeFilters.filter(
              (activeFilter) => activeFilter.id.split('_')[0] !== filter,
            ),
            filters: {
              ...state.filters,
              [filter]: {
                min: null,
                max: null,
              },
            },
          };
        }

        return {
          ...state,
          page: 1,
          loading: true,
          activeFilters: state.activeFilters.filter(
            (activeFilter) => activeFilter.id.split('_')[0] !== filter,
          ),
          filters: {
            ...state.filters,
            [filter]: {
              ...state.filters[filter],
              selectedItems: [],
            },
          },
        };
      },
    ),
  ),
});
