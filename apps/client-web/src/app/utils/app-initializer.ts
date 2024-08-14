import { APP_INITIALIZER, Provider } from '@angular/core';
import { authActions } from '@e-commerce/client-web/auth/data-access';
import { Theme, ThemeService } from '../services/theme.service';
import { jwtDecode } from 'jwt-decode';
import { Store } from '@ngrx/store';

const initializeAppFactory =
  (store: Store, themeService: ThemeService) => () => {
    const refreshToken = localStorage.getItem('refreshToken');

    if (refreshToken) {
      const { exp } = jwtDecode(refreshToken);
      const expirationTime = (exp ?? 0) * 1000 - 60000;

      if (expirationTime <= Date.now()) {
        store.dispatch(authActions.logout());
      }
    }

    const preferenceTheme = localStorage.getItem('theme') as Theme | null;

    const browserTheme: Theme = window.matchMedia(
      '(prefers-color-scheme: dark)',
    ).matches
      ? 'dark'
      : 'light';

    store.dispatch(authActions.init());
    themeService.switchTheme(preferenceTheme ?? browserTheme);
  };

export const AppInitializerProvider: Provider = {
  provide: APP_INITIALIZER,
  useFactory: initializeAppFactory,
  multi: true,
  deps: [Store, ThemeService],
};
