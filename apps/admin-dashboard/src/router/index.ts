import { createRouter, createWebHistory } from 'vue-router';
import { shellRouter } from '@e-commerce/admin-dashboard/book/feature/shell';
import { shellRouter as authRouter } from '@e-commerce/admin-dashboard/auth/feature/shell';
import { useAuthApi } from '@e-commerce/admin-dashboard/auth/api';
import MainLayout from '../views/main-layout.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '',
      component: MainLayout,
      redirect: { name: 'book-list' },
      children: [
        {
          path: '/books',
          name: 'books',
          children: shellRouter,
        },
      ],
    },
    {
      path: '/auth',
      name: 'auth',
      children: authRouter,
    },
    { path: '/:pathMatch(.*)*', redirect: 'books/list' },
  ],
});

router.beforeEach((to) => {
  const { isAuthenticated } = useAuthApi;

  if (!isAuthenticated && to.name !== 'login' && to.name !== 'register') {
    return { name: 'login' };
  }
});

export default router;
