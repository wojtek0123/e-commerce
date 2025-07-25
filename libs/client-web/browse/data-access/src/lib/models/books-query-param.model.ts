import { BooksSortDirection, BooksSortKey } from './books-sort.model';

export interface BooksQueryParam {
  tags: string | null;
  authors: string | null;
  categories: string | null;
  publishers: string | null;
  search: string | null;
  minPrice: number | null;
  maxPrice: number | null;
  page: number;
  size: number;
  sortBy: BooksSortKey;
  sortByMode: BooksSortDirection;
}

export enum BooksQueryParamKey {
  CATEGORIES = 'categories',
  AUTHORS = 'authors',
  PUBLISHERS = 'publishers',
  TAGS = 'tags',
  PAGE = 'page',
  SIZE = 'size',
  MIN_PRICE = 'min_price',
  MAX_PRICE = 'max_price',
  SEARCH = 'search',
  SORT_BY = 'sort_by',
  SORT_BY_MODE = 'sort_by_mode',
}
