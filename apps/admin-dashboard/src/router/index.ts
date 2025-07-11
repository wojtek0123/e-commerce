import { createRouter, createWebHistory } from 'vue-router';
import { useAuthService } from '@e-commerce/admin-dashboard/auth/api';
import MainLayout from '../views/main-layout.vue';
import { Home } from '@e-commerce/admin-dashboard/home/feature/home';

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
          component: (
            await import('@e-commerce/admin-dashboard/home/feature/home')
          ).Home,
        },
        {
          path: '/books',
          name: 'books',
          children: (
            await import('@e-commerce/admin-dashboard/book/feature/shell')
          ).shellRouter,
        },
        {
          path: '/publishers',
          name: 'publishers',
          children: (
            await import('@e-commerce/admin-dashboard/publisher/feature/shell')
          ).shellRouter,
        },
        {
          path: '/shipping-methods',
          name: 'shipping-methods',
          children: (
            await import(
              '@e-commerce/admin-dashboard/shipping-method/feature/shell'
            )
          ).shellRouter,
        },
        {
          path: '/categories',
          name: 'categories',
          children: (
            await import('@e-commerce/admin-dashboard/category/feature/shell')
          ).categoriesShellRoutes,
        },
        {
          path: '/users',
          name: 'users',
          children: (
            await import('@e-commerce/admin-dashboard/user/feature/shell')
          ).usersShellRoutes,
        },
        {
          path: '/countries',
          name: 'countries',
          children: (
            await import('@e-commerce/admin-dashboard/country/feature/shell')
          ).countriesShellRoutes,
        },
      ],
    },
    {
      path: '/auth',
      name: 'auth',
      children: (await import('@e-commerce/admin-dashboard/auth/feature/shell'))
        .shellRouter,
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
