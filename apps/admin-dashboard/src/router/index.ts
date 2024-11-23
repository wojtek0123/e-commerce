import { createRouter, createWebHistory } from 'vue-router';
import { shellRouter } from '@e-commerce/admin-dashboard/book/feature/shell';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/HomeView.vue'),
    },
    {
      path: '/books',
      name: 'books',
      children: shellRouter,
    },
    { path: '/:pathMatch(.*)*', redirect: '/' },
  ],
});

export default router;
