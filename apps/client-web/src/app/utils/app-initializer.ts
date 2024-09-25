import { APP_INITIALIZER, Provider } from '@angular/core';
import { authActions } from '@e-commerce/client-web/auth/data-access';
import { cartActions } from '@e-commerce/client-web/cart/data-access';
import { Theme, ThemeService } from '../services/theme.service';
import { Store } from '@ngrx/store';

const initializeAppFactory =
  (store: Store, themeService: ThemeService) => () => {
    const preferenceTheme = localStorage.getItem('theme') as Theme | null;

    const browserTheme: Theme = window.matchMedia(
      '(prefers-color-scheme: dark)',
    ).matches
      ? 'dark'
      : 'light';

    const userId = localStorage.getItem('user');
    const accessToken = localStorage.getItem('accessToken');

    store.dispatch(authActions.init());
    // themeService.switchTheme(preferenceTheme ?? browserTheme);

    if (userId && accessToken) {
      store.dispatch(cartActions.getShoppingSession());
    } else {
      store.dispatch(cartActions.getCartItemsLocally());
    }
  };

export const AppInitializerProvider: Provider = {
  provide: APP_INITIALIZER,
  useFactory: initializeAppFactory,
  multi: true,
  deps: [Store, ThemeService],
};
