import {
  ApplicationConfig,
  provideExperimentalZonelessChangeDetection,
  isDevMode,
} from '@angular/core';
import {
  provideRouter,
  withComponentInputBinding,
  withInMemoryScrolling,
  withViewTransitions,
} from '@angular/router';
import { appRoutes } from './app.routes';
import {
  provideHttpClient,
  withFetch,
  withInterceptors,
} from '@angular/common/http';
import {
  API_URL,
  provideLocalStorageKeys,
  provideAppRoutePaths,
} from '@e-commerce/client-web/shared/app-config';
import { provideStore } from '@ngrx/store';
import { MessageService } from 'primeng/api';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { authInterceptor } from '@e-commerce/client-web/auth/data-access';
import { provideServiceWorker } from '@angular/service-worker';
import {
  provideClientHydration,
  withEventReplay,
  withIncrementalHydration,
} from '@angular/platform-browser';
import { environment } from '../environments/environment';

export const appConfig: ApplicationConfig = {
  providers: [
    provideClientHydration(withEventReplay(), withIncrementalHydration()),
    provideExperimentalZonelessChangeDetection(),
    provideAppRoutePaths,
    provideLocalStorageKeys,
    {
      provide: API_URL,
      useValue: environment.apiUrl,
    },
    provideRouter(
      appRoutes,
      withComponentInputBinding(),
      withViewTransitions(),
      withInMemoryScrolling({ scrollPositionRestoration: 'top' }),
    ),
    provideStore(),
    provideAnimationsAsync(),
    provideHttpClient(withInterceptors([authInterceptor]), withFetch()),
    MessageService,
    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000',
    }),
  ],
};
