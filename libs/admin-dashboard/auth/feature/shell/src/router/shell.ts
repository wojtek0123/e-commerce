import { RouteRecordRaw } from 'vue-router';
import Shell from '../lib/shell.vue';

export const shellRouter: RouteRecordRaw[] = [
  {
    path: '/auth',
    redirect: '/auth/login',
    component: Shell,
    children: [
      {
        path: 'login',
        name: 'login',
        component: () =>
          import('@e-commerce/admin-dashboard/auth/feature/login').then(
            (c) => c.Login,
          ),
      },
      {
        path: 'register',
        name: 'register',
        component: () =>
          import('@e-commerce/admin-dashboard/auth/feature/register').then(
            (c) => c.Register,
          ),
      },
    ],
  },
];
