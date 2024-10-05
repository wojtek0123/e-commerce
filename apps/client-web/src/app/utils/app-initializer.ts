import { APP_INITIALIZER, Provider } from '@angular/core';
import { authActions } from '@e-commerce/client-web/auth/data-access';
import { ThemeService } from '../services/theme.service';
import { Store } from '@ngrx/store';

const initializeAppFactory = (store: Store) => () => {
  store.dispatch(authActions.init());
};

export const AppInitializerProvider: Provider = {
  provide: APP_INITIALIZER,
  useFactory: initializeAppFactory,
  multi: true,
  deps: [Store, ThemeService],
};
