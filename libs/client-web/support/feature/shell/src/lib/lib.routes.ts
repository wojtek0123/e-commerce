import { Route } from '@angular/router';
import { APP_ROUTES_FEATURE } from '@e-commerce/client-web/shared/app-config';

export const shellRoutes: Route[] = [
  {
    path: APP_ROUTES_FEATURE.SUPPORT.FAQ,
    title: 'FAQ',
    loadChildren: () =>
      import('@e-commerce/client-web/support/feature/faq').then(
        (r) => r.faqRoutes,
      ),
  },
];
