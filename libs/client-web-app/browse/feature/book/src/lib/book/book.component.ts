import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BooksApiService } from '@e-commerce/client-web-app/browse/data-access';
import { ResponseError } from '@e-commerce/client-web-app/shared/data-access/api-types';
import { appRouterConfig } from '@e-commerce/client-web-app/shared/utils/router-config';
import { catchError, ignoreElements, of } from 'rxjs';

@Component({
  selector: 'lib-book',
  standalone: true,
  imports: [AsyncPipe],
  template: `
    @if ({book: book$ | async, error: bookError$ | async}; as vm) { @if
    (!vm.book && !vm.error) {
    <div>Loading...</div>
    } @else if (!vm.book && vm.error) {
    <div>{{ vm.error }}</div>
    } @else if (vm.book && !vm.error) {
    <div class="">
      <div>{{ vm.book.title }}</div>
      <img [src]="vm.book.coverImage" [alt]="vm.book.title + ' cover image'" />
    </div>
    } }
  `,
  styleUrl: './book.component.css',
})
export class BookComponent {
  private booksApi = inject(BooksApiService);
  private route = inject(ActivatedRoute);

  book$ = this.booksApi.getBook$(
    this.route.snapshot.params[appRouterConfig.browse.bookId]
  );
  bookError$ = this.book$.pipe(
    ignoreElements(),
    catchError((responseError: ResponseError) =>
      of(responseError.error.message)
    )
  );
}
