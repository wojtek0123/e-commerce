import { RouteRecordRaw } from 'vue-router';
import { homeRoutes } from '@e-commerce/admin-dashboard/home/feature/home';

export const homeShellRoutes: RouteRecordRaw[] = [
  {
    path: '',
    children: [
      {
        path: '',
        children: [...homeRoutes],
      },
    ],
  },
];
