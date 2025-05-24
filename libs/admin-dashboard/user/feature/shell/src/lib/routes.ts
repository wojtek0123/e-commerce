import { RouteRecordRaw } from 'vue-router';
import { UsersList } from '@e-commerce/admin-dashboard/user/feature/user-list';

export const usersShellRoutes: RouteRecordRaw[] = [
  {
    path: '',
    name: 'user-list',
    component: UsersList,
  },
];
