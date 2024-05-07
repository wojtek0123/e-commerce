import {
  BookTag,
  Category,
} from '@e-commerce/client-web-app/shared/data-access/api-types';
import { appRouterConfig } from '@e-commerce/client-web-app/shared/utils/router-config';

export interface BooksFilters {
  [appRouterConfig.browse.searchQueryParams]: string | null;
  [appRouterConfig.browse.tagsQueryParams]: BookTag[] | null;
  [appRouterConfig.browse.categoriesQueryParams]: Category[] | null;
}
