import { RouteRecordRaw } from 'vue-router';
import { CountryList } from '@e-commerce/admin-dashboard/country/feature/country-list';

export const countriesShellRoutes: RouteRecordRaw[] = [
  {
    path: '',
    name: 'country-list',
    component: CountryList,
  },
];
