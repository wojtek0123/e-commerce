import { Route } from '@angular/router';

export const summaryRoutes: Route[] = [
  {
    path: '',
    loadComponent: () =>
      import('./summary/summary.component').then((c) => c.SummaryComponent),
  },
];
