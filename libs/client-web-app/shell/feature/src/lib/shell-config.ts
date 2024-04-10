import { APP_INITIALIZER, ApplicationConfig } from '@angular/core';
import {
  AuthService,
  authActions,
  authFeature,
  authEffects,
} from '@e-commerce/clint-web-app/shared/data-access/auth';
import { provideEffects } from '@ngrx/effects';
import { Store, provideState } from '@ngrx/store';

export const shellConfig: ApplicationConfig = {
  providers: [
    AuthService,
    {
      provide: APP_INITIALIZER,
      useFactory: (store: Store) => () => {
        store.dispatch(authActions.init());
      },
      multi: true,
      deps: [Store],
    },
    provideState(authFeature),
    provideEffects([authEffects]),
  ],
};
