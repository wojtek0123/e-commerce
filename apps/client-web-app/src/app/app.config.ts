import { provideHttpClient } from '@angular/common/http';
import { ApplicationConfig, isDevMode } from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import {
  provideRouter,
  withEnabledBlockingInitialNavigation,
} from '@angular/router';
import { clientWebAppShellRoutes } from '@e-commerce/client-web-app/shell/feature';
import { provideStore } from '@ngrx/store';
import { provideStoreDevtools } from '@ngrx/store-devtools';

export const appConfig: ApplicationConfig = {
  providers: [
    provideStoreDevtools({ logOnly: !isDevMode(), connectInZone: true }),
    provideHttpClient(),
    provideStore(),
    provideRouter(
      clientWebAppShellRoutes,
      withEnabledBlockingInitialNavigation()
    ),
    provideAnimations(),
  ],
};
