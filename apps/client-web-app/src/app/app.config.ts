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
  ],
};
