import { RouteRecordRaw } from 'vue-router';

export const shellRouter: RouteRecordRaw[] = [
  {
    path: '/books',
    redirect: { name: 'book-list' },
    children: [
      {
        path: '',
        name: 'book-list',
        component: await import(
          '@e-commerce/admin-dashboard/book/feature/book-list'
        ).then((c) => c.BookList),
      },
    ],
  },
];
