import { RouteRecordRaw } from 'vue-router';
import Home from './home.vue';

export const homeRoutes: RouteRecordRaw[] = [
  {
    path: '',
    name: 'home-page',
    component: Home,
  },
];
