import { inject, Injectable } from '@angular/core';
import {
  BooksApiService,
  ResponseError,
} from '@e-commerce/client-web/shared/data-access';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { bookActions } from './book.actions';
import { switchMap } from 'rxjs';
import { mapResponse } from '@ngrx/operators';
import { Store } from '@ngrx/store';

@Injectable()
export class BookEffects {
  private actions$ = inject(Actions);
  private store = inject(Store);
  private bookApi = inject(BooksApiService);

  getBook = createEffect(() =>
    this.actions$.pipe(
      ofType(bookActions.getBook),
      switchMap(({ bookId }) =>
        this.bookApi.getBook$(bookId).pipe(
          mapResponse({
            next: (book) => {
              return bookActions.getBookSuccess({ book });
            },
            error: (error: ResponseError) => {
              return bookActions.getBookFailure({ error });
            },
          }),
        ),
      ),
    ),
  );
}
