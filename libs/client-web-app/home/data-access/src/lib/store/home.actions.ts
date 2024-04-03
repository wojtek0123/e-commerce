import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Category } from '@e-commerce/client-web-app/shared/api-types';

export const homeActions = createActionGroup({
  source: 'Home',
  events: {
    'Get Categories': emptyProps(),
    'Get Categories Success': props<{ categories: Category[] }>(),
    'Get Categories Failure': props<{ error: Error }>(),
  },
});
