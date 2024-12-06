import { createRouter, createWebHistory } from 'vue-router';
import { shellRouter } from '@e-commerce/admin-dashboard/book/feature/shell';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/books',
      name: 'books',
      children: shellRouter,
    },
    { path: '/:pathMatch(.*)*', redirect: '/books' },
  ],
});

export default router;
