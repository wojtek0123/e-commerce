import { RouteRecordRaw } from 'vue-router';

export const shellRouter: RouteRecordRaw[] = [
  {
    path: '/books',
    redirect: '/books/list',
    children: [
      {
        path: 'list',
        name: 'book-list',
        component: () =>
          import('@e-commerce/admin-dashboard/book/feature/book-list').then(
            (c) => c.BookList,
          ),
      },
    ],
  },
];
