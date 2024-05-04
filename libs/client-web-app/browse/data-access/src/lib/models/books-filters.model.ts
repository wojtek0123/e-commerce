import {
  BookTag,
  Category,
} from '@e-commerce/client-web-app/shared/data-access/api-types';

export interface BooksFilters {
  title: string | null;
  tags: BookTag[] | null;
  categories: Category[] | null;
}
