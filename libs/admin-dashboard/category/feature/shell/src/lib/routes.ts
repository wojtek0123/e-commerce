import { RouteRecordRaw } from 'vue-router';
import { CategoriesList } from '@e-commerce/admin-dashboard/category/feature/categories-list';

export const categoriesShellRoutes: RouteRecordRaw[] = [
  {
    path: '',
    name: 'categories-list',
    component: CategoriesList,
  },
];
