import { provideHttpClient } from '@angular/common/http';
import { ApplicationConfig, isDevMode } from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import {
  provideRouter,
  withEnabledBlockingInitialNavigation,
  withViewTransitions,
} from '@angular/router';
import { clientWebAppShellRoutes } from '@e-commerce/client-web-app/shell/feature';
import { provideStore } from '@ngrx/store';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { shellConfig } from '@e-commerce/client-web-app/shell/feature';
import { API_URL } from '@e-commerce/client-web-app/shared/utils/providers';

export const appConfig: ApplicationConfig = {
  providers: [
    ...shellConfig.providers,
    provideStoreDevtools({ logOnly: !isDevMode(), connectInZone: true }),
    provideHttpClient(),
    provideStore(),
    provideRouter(
      clientWebAppShellRoutes,
      withViewTransitions(),
      withEnabledBlockingInitialNavigation()
    ),
    provideAnimations(),
    {
      provide: API_URL,
      useValue: 'http://localhost:3000',
    },
  ],
};
