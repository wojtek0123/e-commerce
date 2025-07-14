import { RouteRecordRaw } from 'vue-router';
import { CategoryList } from '@e-commerce/admin-dashboard/category/feature/category-list';

export const categoriesShellRoutes: RouteRecordRaw[] = [
  {
    path: '',
    name: 'category-list',
    component: CategoryList,
  },
];
