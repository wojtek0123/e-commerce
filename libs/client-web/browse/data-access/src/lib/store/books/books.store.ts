import {
  AuthorApiService,
  BooksApiService,
  CategoryApiService,
} from '@e-commerce/client-web/shared/data-access/api-services';
import {
  Author,
  allBookTags,
  Book,
  BookTag,
  Category,
  ResponseError,
} from '@e-commerce/client-web/shared/data-access/api-models';
import {
  patchState,
  signalStore,
  withComputed,
  withHooks,
  withMethods,
  withState,
} from '@ngrx/signals';
import { ActiveFilter } from '../../models/active-filter.model';
import { computed, DestroyRef, inject } from '@angular/core';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { filter, pipe, switchMap, tap } from 'rxjs';
import { tapResponse } from '@ngrx/operators';
import { Filter } from '../../models/filter.model';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

const FILTER_PAGE = 1 as const;
const FILTER_SIZE = 20 as const;

export interface BooksState {
  books: Book[];
  pendingBookIds: Book['id'][];
  page: number;
  size: number;
  total: number;
  count: number;
  loading: boolean;
  error: string | string[] | null;
  activeFilters: ActiveFilter[];
  search: string | null;
  filters: {
    tag: Filter<BookTag>;
    author: Filter<Author>;
    category: Filter<Category>;
    price: {
      min: number | null;
      max: number | null;
    };
  };
}

export const initialBooksState: BooksState = {
  books: [],
  pendingBookIds: [],
  page: 1,
  size: 20,
  total: 0,
  count: 0,
  loading: false,
  error: null,
  activeFilters: [],
  search: null,
  filters: {
    tag: { items: [], selectedItems: [] },
    author: { items: [], selectedItems: [] },
    category: { items: [], selectedItems: [] },
    price: { min: null, max: null },
  },
};

export const BooksStore = signalStore(
  withState(initialBooksState),
  withComputed(({ filters }) => ({
    selectedAuthors: computed(() => filters().author.selectedItems),
    selectedCategories: computed(() => filters().category.selectedItems),
    selectedTags: computed(() => filters().tag.selectedItems),
    enteredPrices: computed(() =>
      Object.values(filters().price).filter((v) => !!v),
    ),
    minPrice: computed(() => filters().price.min),
    maxPrice: computed(() => filters().price.max),
  })),
  withMethods(
    (
      store,
      booksApi = inject(BooksApiService),
      authorApi = inject(AuthorApiService),
      categoryApi = inject(CategoryApiService),
    ) => ({
      getBooks: rxMethod<void>(
        pipe(
          tap(() => patchState(store, { loading: true })),
          switchMap(() => {
            const filters = store.filters;
            const search = store.search();
            const priceMin = filters.price.min();
            const priceMax = filters.price.max();
            const selectedTags = filters.tag.selectedItems();
            const selectedAuthorsId = filters.author
              .selectedItems()
              .map(({ id }) => id);
            const selectedCategoriesId = filters.category
              .selectedItems()
              .map(({ id }) => id);

            return booksApi
              .getBooks$({
                ...(search && { titleLike: search }),
                ...(priceMin && { priceFrom: priceMin }),
                ...(priceMax && { priceTo: priceMax }),
                tagIn: selectedTags,
                authorIdIn: selectedAuthorsId,
                categoryIdIn: selectedCategoriesId,
                page: store.page(),
                size: store.size(),
              })
              .pipe(
                tapResponse({
                  next: ({ items, total, count }) => {
                    patchState(store, {
                      loading: false,
                      books: items,
                      total,
                      count,
                    });
                  },
                  error: (error: ResponseError) => {
                    patchState(store, {
                      loading: false,
                      error:
                        error?.error?.message ||
                        'Error occur while getting books',
                    });
                  },
                }),
              );
          }),
        ),
      ),
      getAuthors: rxMethod<{ search: string }>(
        pipe(
          switchMap(({ search }) =>
            authorApi
              .getAll$({
                nameLike: search,
                page: FILTER_PAGE,
                size: FILTER_SIZE,
              })
              .pipe(
                tapResponse({
                  next: (authors) => {
                    patchState(store, (state) => ({
                      ...state,
                      filters: {
                        ...state.filters,
                        author: {
                          ...state.filters.author,
                          items: authors,
                        },
                      },
                    }));
                  },
                  error: (error: ResponseError) => {
                    // TODO: display toast noti
                  },
                }),
              ),
          ),
        ),
      ),
      getCategories: rxMethod<{ search: string }>(
        pipe(
          switchMap(({ search }) =>
            categoryApi
              .getCategories$({
                nameLike: search,
                page: FILTER_PAGE,
                size: FILTER_SIZE,
              })
              .pipe(
                tapResponse({
                  next: (categories) => {
                    patchState(store, (state) => ({
                      ...state,
                      filters: {
                        ...state.filters,
                        category: {
                          ...state.filters.category,
                          items: categories,
                        },
                      },
                    }));
                  },
                  error: (error: ResponseError) => {
                    // TODO: display toast noti
                  },
                }),
              ),
          ),
        ),
      ),
      getTags: (search: string) => {
        const allTags = [...allBookTags];

        const tags = allTags
          .filter((tag) => tag.toLowerCase().includes(search.toLowerCase()))
          .slice(0, FILTER_SIZE);

        patchState(store, (state) => ({
          ...state,
          filters: {
            ...state.filters,
            tag: {
              ...state.filters.tag,
              items: tags,
            },
          },
        }));
      },
    }),
  ),
  withMethods((store) => ({
    setSearch: (search: string | null) => {
      patchState(store, (state) => ({
        ...state,
        filters: { ...state.filters, search },
      }));
    },
    setPage: (page: number) => {
      patchState(store, { page });
    },
    setSize: (size: number) => {
      patchState(store, { size });
    },
    setSelectedItems: <T>(
      selectedItems: T[],
      filter: keyof BooksState['filters'],
      activeFilter: ActiveFilter,
    ) => {
      // const activeFilter = {
      //   id: `${filter}_${category.name}`,
      //   name: category.name ?? '',
      // };

      patchState(store, (state) => ({
        ...state,
        activeFilters: state.activeFilters.find(
          (filter) => filter.id === activeFilter.id,
        )
          ? state.activeFilters.filter(
              (filter) => filter.id !== activeFilter.id,
            )
          : [...state.activeFilters, activeFilter],
        filters: {
          ...state.filters,
          [filter]: {
            ...state.filters[filter],
            selectedItems,
          },
        },
      }));

      store.getBooks();
    },
    setPrice: (value: number | null, key: 'min' | 'max') => {
      const activeFilters = store
        .activeFilters()
        .filter(({ id }) => id !== `price_${key}`);

      patchState(store, (state) => ({
        ...state,
        activeFilters: !value
          ? activeFilters
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
      }));

      store.getBooks();
    },
    clearSelectedItems: (filter: keyof BooksState['filters']) => {
      if (filter === 'price') {
        patchState(store, (state) => ({
          ...state,
          page: 1,
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
        }));
      } else {
        patchState(store, (state) => ({
          ...state,
          page: 1,
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
        }));
      }

      store.getBooks();
    },
    removeActiveFilter: (activeFilterId: ActiveFilter['id']) => {
      console.log(activeFilterId);
      const [filter, itemId] = activeFilterId.split('_') as [
        keyof BooksState['filters'],
        string,
      ];

      if (filter === 'price') {
        patchState(store, (state) => ({
          ...state,
          page: 1,
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
        }));
      } else {
        patchState(store, (state) => ({
          ...state,
          activeFilters: state.activeFilters.filter(
            ({ id }) => id !== activeFilterId,
          ),
          filters: {
            ...state.filters,
            [filter]: {
              ...state.filters[filter],
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
        }));
      }

      store.getBooks();
    },
    removeActiveFilters: () => {
      if (store.activeFilters().length === 0) return;

      patchState(store, (state) => ({
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
      }));

      store.getBooks();
    },
  })),
  withHooks({
    onInit(store) {
      const router = inject(Router);
      const route = inject(ActivatedRoute);
      const destroyRef = inject(DestroyRef);

      store.getBooks();
      store.getAuthors({ search: '' });
      store.getCategories({ search: '' });
      store.getTags('');

      router.events
        .pipe(
          filter((events) => events instanceof NavigationEnd),
          takeUntilDestroyed(destroyRef),
        )
        .subscribe(async () => {
          const category: Category | null = history.state?.category
            ? JSON.parse(history.state.category)
            : null;

          if (category) {
            history.replaceState({}, '');

            const activeFilter = {
              id: `category_${category.id}`,
              name: category.name ?? '',
            };

            store.removeActiveFilters();

            store.setSelectedItems([category], 'category', activeFilter);

            await router.navigate([], {
              relativeTo: route,
              queryParams: null,
              replaceUrl: true,
            });
          }
        });
    },
  }),
);
