import { Author, Category } from '@e-commerce/shared/api-models';
import { BooksSortDirection, BooksSortKey } from './books-sort.model';
import { Tag } from './tag.model';

export interface BooksQueryParam {
  selectedTags: Tag[];
  selectedAuthors: Author[];
  selectedCategories: Category[];
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
  TAGS = 'tags',
  PAGE = 'page',
  SIZE = 'size',
  MIN_PRICE = 'min_price',
  MAX_PRICE = 'max_price',
  SEARCH = 'search',
  SORT_BY = 'sort_by',
  SORT_BY_MODE = 'sort_by_mode',
}
