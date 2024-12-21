import { RouteRecordRaw } from 'vue-router';
import Shell from '../lib/shell.vue';
import { useAuthStore } from '@e-commerce/admin-dashboard/auth/data-access';

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
    ],
    beforeEnter: () => {
      const authStore = useAuthStore();

      if (authStore.isAuthenticated) {
        return 'books/list';
      }
    },
  },
];
