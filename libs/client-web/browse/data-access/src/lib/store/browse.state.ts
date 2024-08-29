import {
  Author,
  Book,
  BookTag,
  Category,
} from '@e-commerce/client-web/shared/data-access';
import { Filter } from '../models/filter.model';
import { ActiveFilter } from '../models/active-filter.model';

export interface BrowseState {
  books: Book[];
  pendingBookIds: Book['id'][];
  page: number;
  size: number;
  search: string | null;
  total: number;
  count: number;
  loading: boolean;
  error: string | string[] | null;
  activeFilters: ActiveFilter[];
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

export const initialBrowseState: BrowseState = {
  books: [],
  pendingBookIds: [],
  page: 1,
  size: 20,
  total: 0,
  count: 0,
  loading: false,
  error: null,
  search: null,
  activeFilters: [],
  filters: {
    tag: { items: [], selectedItems: [] },
    author: { items: [], selectedItems: [] },
    category: { items: [], selectedItems: [] },
    price: { min: null, max: null },
  },
};
