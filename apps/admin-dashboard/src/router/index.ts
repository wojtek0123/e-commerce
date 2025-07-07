import { createRouter, createWebHistory } from 'vue-router';
import { shellRouter as bookShell } from '@e-commerce/admin-dashboard/book/feature/shell';
import { shellRouter as authRouter } from '@e-commerce/admin-dashboard/auth/feature/shell';
import { useAuthService } from '@e-commerce/admin-dashboard/auth/api';
import MainLayout from '../views/main-layout.vue';
import { categoriesShellRoutes } from '@e-commerce/admin-dashboard/category/feature/shell';
import { Home } from '@e-commerce/admin-dashboard/home/feature/home';
import { usersShellRoutes } from '@e-commerce/admin-dashboard/user/feature/shell';
import { countriesShellRoutes } from '@e-commerce/admin-dashboard/country/feature/shell';

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
          component: Home,
        },
        {
          path: '/books',
          name: 'books',
          children: bookShell,
        },
        {
          path: '/categories',
          name: 'categories',
          children: categoriesShellRoutes,
        },
        {
          path: '/users',
          name: 'users',
          children: usersShellRoutes,
        },
        {
          path: '/countries',
          name: 'countries',
          children: countriesShellRoutes,
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
