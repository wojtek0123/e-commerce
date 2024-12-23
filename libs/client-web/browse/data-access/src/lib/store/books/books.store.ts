import {
  AuthorApiService,
  BooksApiService,
  CategoryApiService,
} from '@e-commerce/client-web/shared/data-access/api-services';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  Author,
  allBookTags,
  Book,
  BookTag,
  Category,
  ResponseError,
} from '@e-commerce/shared/api-models';
import {
  getState,
  patchState,
  signalStore,
  type,
  withComputed,
  withHooks,
  withMethods,
  withProps,
  withState,
} from '@ngrx/signals';
import { ActiveFilter } from '../../models/active-filter.model';
import {
  afterNextRender,
  computed,
  DestroyRef,
  effect,
  inject,
  untracked,
} from '@angular/core';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import {
  distinctUntilChanged,
  filter,
  forkJoin,
  map,
  of,
  pipe,
  skip,
  switchMap,
  tap,
} from 'rxjs';
import { tapResponse } from '@ngrx/operators';
import { Filter } from '../../models/filter.model';
import {
  ActivatedRoute,
  NavigationEnd,
  ParamMap,
  Router,
} from '@angular/router';
import {
  addEntities,
  addEntity,
  entityConfig,
  removeAllEntities,
  removeEntities,
  removeEntity,
  setEntity,
  withEntities,
} from '@ngrx/signals/entities';
import { isEqual } from 'lodash-es';
import {
  getSelectedItemsFromQueryParam,
  buildSelectedItemsQueryParam,
} from '@e-commerce/client-web/browse/utils';
import { Tag } from '../../models/tag.model';
import { MessageService } from 'primeng/api';

const FILTER_PAGE = 1 as const;
const FILTER_SIZE = 20 as const;

export const sizes = [20, 40, 60];

export interface BooksState {
  books: Book[];
  pendingBookIds: Book['id'][];
  page: number;
  size: number;
  total: number;
  count: number;
  loading: boolean;
  error: string | string[] | null;
  filters: {
    multiSelect: {
      tag: Filter<{ id: BookTag; name: BookTag }>;
      author: Filter<Author>;
      category: Filter<Category>;
    };
    singleValue: {
      minPrice: number | null;
      maxPrice: number | null;
      search: string | null;
    };
  };
}

export type MultiSelectFilters = keyof BooksState['filters']['multiSelect'];
export type SingleValueFilters = keyof BooksState['filters']['singleValue'];
export type Filters = MultiSelectFilters | SingleValueFilters;

const allSingleValueFilters: SingleValueFilters[] = [
  'search',
  'minPrice',
  'maxPrice',
];

const activeFilterConfig = entityConfig({
  entity: type<ActiveFilter>(),
  collection: '_activeFilters',
  selectId: (activeFilter) => activeFilter.id,
});

export const initialBooksState: BooksState = {
  books: [],
  pendingBookIds: [],
  page: 1,
  size: 20,
  total: 0,
  count: 0,
  loading: false,
  error: null,
  filters: {
    multiSelect: {
      tag: { items: [], selectedItems: [] },
      author: { items: [], selectedItems: [] },
      category: { items: [], selectedItems: [] },
    },
    singleValue: {
      minPrice: null,
      maxPrice: null,
      search: null,
    },
  },
};

export const BooksStore = signalStore(
  withState(initialBooksState),
  withEntities(activeFilterConfig),
  withComputed(({ filters, _activeFiltersEntities }) => ({
    selectedAuthors: computed(() => filters().multiSelect.author.selectedItems),
    selectedCategories: computed(
      () => filters().multiSelect.category.selectedItems,
    ),
    selectedTags: computed(() => filters().multiSelect.tag.selectedItems),
    enteredPrices: computed(() =>
      [filters().singleValue.minPrice, filters().singleValue.maxPrice].filter(
        (v) => !!v,
      ),
    ),
    minPrice: computed(() => filters().singleValue.minPrice),
    maxPrice: computed(() => filters().singleValue.maxPrice),
    activeFilters: computed(() => _activeFiltersEntities()),
    search: computed(() => filters().singleValue.search),
  })),
  withProps(() => ({
    _bookApi: inject(BooksApiService),
    _authorApi: inject(AuthorApiService),
    _categoryApi: inject(CategoryApiService),
    _messageService: inject(MessageService),
    _router: inject(Router),
    _route: inject(ActivatedRoute),
  })),
  withMethods((store) => ({
    getBooks: rxMethod<void>(
      pipe(
        tap(() => patchState(store, { loading: true })),
        switchMap(() => {
          const {
            filters: { multiSelect, singleValue },
          } = getState(store);

          const priceMin = singleValue.minPrice;
          const priceMax = singleValue.maxPrice;
          const selectedTags = multiSelect.tag.selectedItems.map(
            ({ id }) => id,
          );
          const selectedAuthorsId = multiSelect.author.selectedItems.map(
            ({ id }) => id,
          );
          const selectedCategoriesId = multiSelect.category.selectedItems.map(
            ({ id }) => id,
          );

          return store._bookApi
            .getBooks$({
              ...(singleValue.search && { titleLike: singleValue.search }),
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
          store._authorApi
            .getAll$({
              nameLike: search,
              page: FILTER_PAGE,
              size: FILTER_SIZE,
            })
            .pipe(
              tapResponse({
                next: (authors) => {
                  patchState(store, (state) => ({
                    filters: {
                      ...state.filters,
                      multiSelect: {
                        ...state.filters.multiSelect,
                        author: {
                          ...state.filters.multiSelect.author,
                          items: authors,
                        },
                      },
                    },
                  }));
                },
                error: (error: ResponseError) => {
                  store._messageService.add({
                    summary: 'Error',
                    severity: 'error',
                    detail:
                      error?.error?.message ??
                      'Error occured while getting authors to filter',
                  });
                },
              }),
            ),
        ),
      ),
    ),
    getCategories: rxMethod<{ search: string }>(
      pipe(
        switchMap(({ search }) =>
          store._categoryApi
            .getCategories$({
              nameLike: search,
              page: FILTER_PAGE,
              size: FILTER_SIZE,
            })
            .pipe(
              tapResponse({
                next: (categories) => {
                  patchState(store, (state) => ({
                    filters: {
                      ...state.filters,
                      multiSelect: {
                        ...state.filters.multiSelect,
                        category: {
                          ...state.filters.multiSelect.category,
                          items: categories,
                        },
                      },
                    },
                  }));
                },
                error: (error: ResponseError) => {
                  store._messageService.add({
                    summary: 'Error',
                    severity: 'error',
                    detail:
                      error?.error?.message ??
                      'Error occured while getting categories to filter',
                  });
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
          multiSelect: {
            ...state.filters.multiSelect,
            tag: {
              ...state.filters.multiSelect.tag,
              items: tags.map((tag) => ({ id: tag, name: tag })),
            },
          },
        },
      }));
    },
  })),
  withMethods((store) => ({
    setPage: (page: number) => {
      patchState(store, { page });
    },
    setSize: (size: number) => {
      patchState(store, { size });
    },
    selectItem: <T extends { id: string; name: string }>(
      item: T,
      filter: MultiSelectFilters,
    ) => {
      const activeFilter: ActiveFilter = {
        id: item.id,
        filter,
        value: filter === 'tag' ? item.name.toLowerCase() : item.name,
      };

      patchState(
        store,
        addEntity(activeFilter, activeFilterConfig),
        (state) => ({
          filters: {
            ...state.filters,
            multiSelect: {
              ...state.filters.multiSelect,
              [filter]: {
                ...state.filters.multiSelect[filter],
                selectedItems: [
                  ...state.filters.multiSelect[filter].selectedItems,
                  item,
                ],
              },
            },
          },
        }),
      );
    },
    unselectItem: <T extends { id: string; name: string }>(
      item: T,
      filter: MultiSelectFilters,
    ) => {
      const selectedItems = getState(store).filters.multiSelect[
        filter
      ].selectedItems.filter((selectedItem) => selectedItem.id !== item.id);

      patchState(store, removeEntity(item.id, activeFilterConfig), (state) => ({
        filters: {
          ...state.filters,
          multiSelect: {
            ...state.filters.multiSelect,
            [filter]: {
              ...state.filters.multiSelect[filter],
              selectedItems,
            },
          },
        },
      }));
    },
    setSingleValueFilter: <T>(value: T | null, filter: SingleValueFilters) => {
      const activeFilter: ActiveFilter = {
        id: filter,
        filter,
        value: value?.toString() ?? '',
      };
      const isFilterSearch = filter === 'search';

      if (!isFilterSearch && value !== null) {
        patchState(store, setEntity(activeFilter, activeFilterConfig));
      } else if (!isFilterSearch) {
        patchState(store, removeEntity(filter, activeFilterConfig));
      }

      patchState(store, (state) => ({
        ...state,
        filters: {
          ...state.filters,
          singleValue: {
            ...state.filters.singleValue,
            [filter]: value,
          },
        },
      }));
    },
    clearSelectedItems: (filter: MultiSelectFilters) => {
      patchState(
        store,
        removeEntities(
          (activeFilter) => activeFilter.filter === filter,
          activeFilterConfig,
        ),
        (state) => ({
          ...state,
          page: 1,
          filters: {
            ...state.filters,
            multiSelect: {
              ...state.filters.multiSelect,
              [filter]: {
                ...state.filters.multiSelect[filter],
                selectedItems: [],
              },
            },
          },
        }),
      );
    },
    removeActiveFilter: (activeFilter: ActiveFilter) => {
      const { filter, id } = activeFilter;

      const isSingleValueFilter = (allSingleValueFilters as string[]).includes(
        filter,
      );

      if (isSingleValueFilter) {
        patchState(store, removeEntity(id, activeFilterConfig), (state) => ({
          ...state,
          page: 1,
          filters: {
            ...state.filters,
            singleValue: {
              ...state.filters.singleValue,
              [filter]: null,
            },
          },
        }));
      } else {
        patchState(store, removeEntity(id, activeFilterConfig), (state) => ({
          ...state,
          filters: {
            ...state.filters,
            multiSelect: {
              ...state.filters.multiSelect,
              [filter]: {
                ...state.filters.multiSelect[filter as MultiSelectFilters],
                selectedItems: state.filters.multiSelect[
                  filter as MultiSelectFilters
                ].selectedItems.filter(
                  (selectedItem) => selectedItem.id !== id,
                ),
              },
            },
          },
        }));
      }
    },
    removeActiveFilters: () => {
      patchState(store, removeAllEntities(activeFilterConfig), (state) => ({
        page: 1,
        filters: {
          multiSelect: {
            category: {
              ...state.filters.multiSelect.category,
              selectedItems: [],
            },
            tag: {
              ...state.filters.multiSelect.tag,
              selectedItems: [],
            },
            author: {
              ...state.filters.multiSelect.author,
              selectedItems: [],
            },
          },
          singleValue: {
            minPrice: null,
            maxPrice: null,
            search: null,
          },
        },
      }));
    },
    setQueryParams: ({
      selectedTags,
      selectedAuthors,
      selectedCategories,
      search,
      minPrice,
      maxPrice,
      page,
      size,
    }: {
      selectedTags: Tag[];
      selectedAuthors: Author[];
      selectedCategories: Category[];
      search: string | null;
      minPrice: number | null;
      maxPrice: number | null;
      page: number;
      size: number;
    }) => {
      store._router.navigate([], {
        relativeTo: store._route,
        queryParams: {
          tags: buildSelectedItemsQueryParam(
            selectedTags,
            'name',
          )?.toLowerCase(),
          categories: buildSelectedItemsQueryParam(selectedCategories, 'name'),
          authors: buildSelectedItemsQueryParam(selectedAuthors, 'name'),
          search: search || null,
          min_price: minPrice,
          max_price: maxPrice,
          size,
          page,
        },
        replaceUrl: true,
      });
    },
  })),
  withMethods((store) => ({
    _deserializeQueryParamsFilters: rxMethod<{ queryParam: ParamMap }>(
      pipe(
        tap(() => patchState(store, { loading: true })),
        map(({ queryParam }) => {
          return {
            categories: queryParam.get('categories'),
            authors: queryParam.get('authors'),
            tags: queryParam.get('tags'),
            page: queryParam.get('page'),
            size: queryParam.get('size'),
            minPrice: queryParam.get('min_price'),
            maxPrice: queryParam.get('max_price'),
            search: queryParam.get('search'),
          };
        }),
        switchMap((params) => {
          const requests = {
            categories$: params.categories
              ? store._categoryApi.getCategories$({
                  nameIn: getSelectedItemsFromQueryParam(params.categories),
                })
              : of([]),

            authors$: params.authors
              ? store._authorApi.getAll$({
                  nameIn: getSelectedItemsFromQueryParam(params.authors),
                })
              : of([]),

            tags$: of(
              getSelectedItemsFromQueryParam(params.tags)
                ?.split(',')
                .map((t) => t.toUpperCase())
                .filter((t) => (allBookTags as string[]).includes(t))
                .map((t): { id: BookTag; name: BookTag } => ({
                  id: t as BookTag,
                  name: t as BookTag,
                })) ?? [],
            ),

            size$: of(
              sizes.includes(Number(params.size))
                ? Number(params.size)
                : FILTER_SIZE,
            ),
          };

          return forkJoin(requests).pipe(
            map(({ categories$, authors$, tags$, size$ }) => ({
              categories: categories$,
              authors: authors$,
              tags: tags$,
              size: size$,
              page: Number(params.page) || 1,
              search: params.search || null,
              minPrice: params.minPrice ? Number(params.minPrice) : null,
              maxPrice: params.maxPrice ? Number(params.maxPrice) : null,
            })),
          );
        }),
        tapResponse({
          next: (params) => {
            const activeFilters: ActiveFilter[] = [
              ...params.categories.map((c) => ({
                id: c.id,
                filter:
                  'category' satisfies MultiSelectFilters as MultiSelectFilters,
                value: c.name,
              })),
              ...params.authors.map((a) => ({
                id: a.id,
                filter:
                  'author' satisfies MultiSelectFilters as MultiSelectFilters,
                value: a.name,
              })),
              ...params.tags.map((t) => ({
                id: t.id,
                filter:
                  'tag' satisfies MultiSelectFilters as MultiSelectFilters,
                value: t.name.toLowerCase(),
              })),
            ];

            if (params.minPrice) {
              activeFilters.push({
                id: 'minPrice' satisfies SingleValueFilters,
                filter: 'minPrice' satisfies SingleValueFilters,
                value: params.minPrice.toString(),
              });
            }

            if (params.maxPrice) {
              activeFilters.push({
                id: 'maxPrice' satisfies SingleValueFilters,
                filter: 'maxPrice' satisfies SingleValueFilters,
                value: params.maxPrice.toString(),
              });
            }

            patchState(
              store,
              removeAllEntities(activeFilterConfig),
              addEntities(activeFilters, activeFilterConfig),
              (state) => ({
                ...(params.page && { page: Number(params.page) }),
                ...(params.size && { size: Number(params.size) }),
                filters: {
                  multiSelect: {
                    ...state.filters.multiSelect,
                    category: {
                      ...state.filters.multiSelect.category,
                      selectedItems: params.categories,
                    },
                    author: {
                      ...state.filters.multiSelect.author,
                      selectedItems: params.authors,
                    },
                    tag: {
                      ...state.filters.multiSelect.tag,
                      selectedItems: params.tags,
                    },
                  },
                  singleValue: {
                    search: params.search,
                    minPrice: params.minPrice,
                    maxPrice: params.maxPrice,
                  },
                },
              }),
            );
          },
          error: (error: ResponseError) => {
            console.error(error?.error?.message);
          },
        }),
      ),
    ),
    restoreQueryParamsFilters: () => {
      const {
        page,
        size,
        filters: { multiSelect, singleValue },
      } = getState(store);

      const selectedTags = multiSelect.tag.selectedItems;
      const selectedAuthors = multiSelect.author.selectedItems;
      const selectedCategories = multiSelect.category.selectedItems;
      const search = singleValue.search;
      const minPrice = singleValue.minPrice;
      const maxPrice = singleValue.maxPrice;

      store.setQueryParams({
        selectedTags,
        selectedCategories,
        selectedAuthors,
        search,
        minPrice,
        maxPrice,
        page,
        size,
      });
    },
    _serializeQueryParamsFilters: rxMethod<{
      selectedTags: { id: BookTag; name: BookTag }[];
      selectedAuthors: Author[];
      selectedCategories: Category[];
      search: string | null;
      minPrice: number | null;
      maxPrice: number | null;
      page: number;
      size: number;
    }>(
      pipe(
        skip(1),
        distinctUntilChanged((prev, curr) => isEqual(prev, curr)),
        tap(
          ({
            selectedTags,
            selectedAuthors,
            selectedCategories,
            search,
            minPrice,
            maxPrice,
            page,
            size,
          }) => {
            store.setQueryParams({
              selectedTags,
              selectedCategories,
              selectedAuthors,
              search,
              minPrice,
              maxPrice,
              page,
              size,
            });
            store.getBooks();
          },
        ),
      ),
    ),
    getAllFilters: () => {
      store.getTags('');
      store.getCategories({ search: '' });
      store.getAuthors({ search: '' });
    },
  })),
  withHooks({
    onInit(store, _destroyRef = inject(DestroyRef)) {
      store.getAllFilters();
      store.getBooks();

      store._deserializeQueryParamsFilters({
        queryParam: store._route.snapshot.queryParamMap,
      });

      afterNextRender(() => {
        store._router.events
          .pipe(
            filter(
              (event): event is NavigationEnd => event instanceof NavigationEnd,
            ),
            map(() => history.state['clearFilters'] ?? false),
            filter((shouldClearFilters) => shouldClearFilters),
            tap((shouldClearFilters) => {
              if (shouldClearFilters) {
                store.restoreQueryParamsFilters();
              }
            }),
            map(() => store._route.snapshot.queryParamMap),
            takeUntilDestroyed(_destroyRef),
          )
          .subscribe((queryParam) => {
            store._deserializeQueryParamsFilters({ queryParam });
          });
      });

      effect(() => {
        const filters = {
          selectedTags: store.selectedTags(),
          selectedAuthors: store.selectedAuthors(),
          selectedCategories: store.selectedCategories(),
          search: store.search(),
          minPrice: store.minPrice(),
          maxPrice: store.maxPrice(),
          page: store.page(),
          size: store.size(),
        };

        untracked(() => {
          store._serializeQueryParamsFilters(filters);
        });
      });
    },
  }),
);
