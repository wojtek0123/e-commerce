import { RouteRecordRaw } from 'vue-router';
import CategoriesList from './categories-list.vue';

export const categoriesRoutes: RouteRecordRaw[] = [
  {
    path: '',
    name: 'categories-list',
    component: CategoriesList,
  },
];
