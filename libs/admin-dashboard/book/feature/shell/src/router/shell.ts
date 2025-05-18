import { RouteRecordRaw } from 'vue-router';
import { BookList } from '@e-commerce/admin-dashboard/book/feature/book-list';

export const shellRouter: RouteRecordRaw[] = [
  {
    path: '/books',
    redirect: { name: 'book-list' },
    children: [
      {
        path: 'list',
        name: 'book-list',
        component: BookList,
      },
    ],
  },
];
