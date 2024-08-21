import {
  ResponseError,
  BookDetails,
} from '@e-commerce/client-web/shared/data-access';
import { createActionGroup, props } from '@ngrx/store';

export const bookActions = createActionGroup({
  source: 'book',
  events: {
    getBook: props<{ bookId: BookDetails['id'] }>(),
    getBookSuccess: props<{ book: BookDetails }>(),
    getBookFailure: props<{ error: ResponseError }>(),
  },
});
