import { Route } from '@angular/router';
import { BookComponent } from './book/book.component';
import { BooksApiService } from '@e-commerce/client-web-app/browse/data-access';

export const bookRoutes: Route[] = [
  { path: '', component: BookComponent, providers: [BooksApiService] },
];
