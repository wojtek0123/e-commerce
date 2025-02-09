import { createRouter, createWebHistory } from 'vue-router';
import { shellRouter } from '@e-commerce/admin-dashboard/book/feature/shell';
import { shellRouter as authRouter } from '@e-commerce/admin-dashboard/auth/feature/shell';
import { useAuthService } from '@e-commerce/admin-dashboard/auth/api';
import MainLayout from '../views/main-layout.vue';
import { categoriesShellRoutes } from '@e-commerce/admin-dashboard/category/feature/shell';
import { homeShellRoutes } from '@e-commerce/admin-dashboard/home/feature/shell';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '',
      component: MainLayout,
      redirect: { name: 'book-list' },
      children: [
        {
          path: '',
          name: 'home',
          children: homeShellRoutes,
        },
        {
          path: '/books',
          name: 'books',
          children: shellRouter,
        },
        {
          path: '/categories',
          name: 'categories',
          children: categoriesShellRoutes,
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
  const authService = useAuthService();

  if (
    !authService.isAuthenticated.value &&
    to.name !== 'login' &&
    to.name !== 'register'
  ) {
    return { name: 'login' };
  }
});

export default router;
