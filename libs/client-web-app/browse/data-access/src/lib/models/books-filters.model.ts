import {
  BookTag,
  Category,
} from '@e-commerce/client-web-app/shared/data-access/api-types';
import { RouterConfig } from '@e-commerce/client-web-app/browse/utils/router-config';

export interface BooksFilters {
  [RouterConfig.searchQueryParams]: string | null;
  [RouterConfig.tagsQueryParams]: BookTag[] | null;
  [RouterConfig.categoriesQueryParams]: Category[] | null;
}
