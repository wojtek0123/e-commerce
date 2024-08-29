import { Category } from '../../api-models';

export interface CategoryState {
  categories: Category[];
  loading: boolean;
  error: string | string[] | null;
}

export const initialCategoryState: CategoryState = {
  categories: [],
  loading: false,
  error: null,
};
