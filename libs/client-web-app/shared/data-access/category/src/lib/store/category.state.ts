import {
  Category,
  ApiStatus,
} from '@e-commerce/client-web-app/shared/data-access/api-types';

export interface CategoryState {
  categories: Category[];
  status: ApiStatus;
}

export const initialCategoryState: CategoryState = {
  categories: [],
  status: 'idle',
};
