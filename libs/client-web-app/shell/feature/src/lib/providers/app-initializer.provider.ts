import { APP_INITIALIZER, Provider } from '@angular/core';
import { AuthService } from '@e-commerce/client-web-app/shared/data-access/auth';
import {
  Theme,
  ThemeSwitherService,
} from '@e-commerce/client-web-app/shell/data-access/theme-switcher';
import { jwtDecode } from 'jwt-decode';
import { appRouterConfig } from '@e-commerce/client-web-app/shared/utils/router-config';

const initializeAppFactory =
  (authService: AuthService, themeSwitcherService: ThemeSwitherService) =>
  () => {
    const refreshToken = localStorage.getItem(
      appRouterConfig.localStorage.refreshToken
    );

    if (refreshToken) {
      const { exp } = jwtDecode(refreshToken);
      const expirationTime = (exp ?? 0) * 1000 - 60000;

      if (expirationTime <= Date.now()) {
        authService.removeSession();
      }
    }

    const preferenceTheme = localStorage.getItem(
      appRouterConfig.localStorage.theme
    ) as Theme | null;

    const browserTheme: Theme = window.matchMedia(
      '(prefers-color-scheme: dark)'
    ).matches
      ? 'dark'
      : 'light';

    themeSwitcherService.switchTheme(preferenceTheme ?? browserTheme);
  };

export const AppInitializerProvider: Provider = {
  provide: APP_INITIALIZER,
  useFactory: initializeAppFactory,
  multi: true,
  deps: [AuthService, ThemeSwitherService],
};
