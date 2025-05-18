import { RouteRecordRaw } from 'vue-router';

export const homeShellRoutes: RouteRecordRaw[] = [
  {
    path: '',
    children: [
      {
        path: '',
        component: () =>
          import('@e-commerce/admin-dashboard/home/feature/home').then(
            (c) => c.Home,
          ),
      },
    ],
  },
];
