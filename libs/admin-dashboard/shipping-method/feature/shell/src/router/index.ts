import { RouteRecordRaw } from 'vue-router';
import { ShippingMethodList } from '@e-commerce/admin-dashboard/shipping-method/feature/shipping-method-list';

export const shellRouter: RouteRecordRaw[] = [
  {
    path: '/shipping-methods',
    children: [
      {
        path: '',
        name: 'shipping-method-list',
        component: ShippingMethodList,
      },
    ],
  },
];
