import { RouteRecordRaw } from 'vue-router';
import { PublisherList } from '@e-commerce/admin-dashboard/publisher/feature/publisher-list';

export const shellRouter: RouteRecordRaw[] = [
  {
    path: '/publishers',
    children: [
      {
        path: '',
        name: 'publisher-list',
        component: PublisherList,
      },
    ],
  },
];
