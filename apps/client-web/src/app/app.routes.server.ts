import { inject } from '@angular/core';
import { RenderMode, ServerRoute } from '@angular/ssr';
import {
  APP_ROUTES_FEATURE,
  APP_ROUTES_PARAMS,
} from '@e-commerce/client-web/shared/app-config';
import { BooksApiService } from '@e-commerce/client-web/shared/data-access/api-services';
import { firstValueFrom, map } from 'rxjs';

export const serverRoutes: ServerRoute[] = [
  {
    path: APP_ROUTES_FEATURE.HOME.BASE,
    renderMode: RenderMode.Server,
  },
  {
    path: APP_ROUTES_FEATURE.BROWSE.BOOKS,
    renderMode: RenderMode.Server,
  },
  {
    path: `${APP_ROUTES_FEATURE.BROWSE.BASE}/${APP_ROUTES_FEATURE.BROWSE.BOOK}/:${APP_ROUTES_PARAMS.BROWSE_BOOK_ID}`,
    renderMode: RenderMode.Prerender,
    async getPrerenderParams() {
      const bookApi = inject(BooksApiService);
      const books = await firstValueFrom(
        bookApi.getBooks$({}).pipe(map(({ items }) => items)),
      );

      return books.map(({ id }) => ({
        [APP_ROUTES_PARAMS.BROWSE_BOOK_ID]: id,
      }));
    },
  },
  {
    path: '**',
    renderMode: RenderMode.Client,
  },
];
