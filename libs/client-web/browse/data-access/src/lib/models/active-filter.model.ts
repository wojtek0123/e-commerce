import {
  MultiSelectFilters,
  SingleValueFilters,
} from '../store/books/books.store';

export interface ActiveFilter {
  id: string;
  filter: MultiSelectFilters | SingleValueFilters;
  value: string;
}
