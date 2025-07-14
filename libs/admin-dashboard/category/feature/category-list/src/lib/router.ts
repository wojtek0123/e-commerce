import { RouteRecordRaw } from 'vue-router';
import CategoryList from './category-list.vue';

export const categoriesRoutes: RouteRecordRaw[] = [
  {
    path: '',
    name: 'category-list',
    component: CategoryList,
  },
];
