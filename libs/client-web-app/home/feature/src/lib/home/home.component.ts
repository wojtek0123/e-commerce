import { Component, HostBinding, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  appRouterConfig,
  browseRoutePaths,
} from '@e-commerce/client-web-app/shared/utils/router-config';
import { ButtonModule } from 'primeng/button';
import {
  BookCardComponent,
  BookCardSkeletonComponent,
} from '@e-commerce/client-web-app/shared/ui/book-card';
import {
  BookTag,
  ResponseError,
} from '@e-commerce/client-web-app/shared/data-access/api-types';
import { BooksApiService } from '@e-commerce/client-web-app/shared/data-access/api-services';
import { catchError, ignoreElements, of } from 'rxjs';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'lib-feature',
  standalone: true,
  imports: [
    ButtonModule,
    RouterLink,
    BookCardComponent,
    AsyncPipe,
    BookCardSkeletonComponent,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  @HostBinding('class') class = 'w-full';

  private booksApi = inject(BooksApiService);

  browseRoutePaths = browseRoutePaths;
  appRouterConfig = appRouterConfig;

  bestSellerSection = signal({
    text: 'See all',
    url: browseRoutePaths.default,
    queryParams: {
      [appRouterConfig.browse.tagsQueryParams]: BookTag.BESTSELLER,
    },
  });

  skeletons = new Array(4);
  books$ = this.booksApi.getBooks$({ tagsIn: [BookTag.BESTSELLER] });
  booksError$ = this.books$.pipe(
    ignoreElements(),
    catchError((responseError: ResponseError) =>
      of(responseError.error.message)
    )
  );
}
