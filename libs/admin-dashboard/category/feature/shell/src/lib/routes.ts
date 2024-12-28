import { RouteRecordRaw } from 'vue-router';
import { categoriesRoutes } from '@e-commerce/admin-dashboard/category/feature/categories-list';

export const categoriesShellRoutes: RouteRecordRaw[] = [
  {
    path: '',
    redirect: { name: 'categories-list' },
    children: [
      {
        path: 'list',
        children: [...categoriesRoutes],
      },
    ],
  },
];
