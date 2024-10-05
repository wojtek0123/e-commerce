import {
  ApplicationConfig,
  provideExperimentalZonelessChangeDetection,
  isDevMode,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { appRoutes } from './app.routes';
import {
  provideHttpClient,
  withFetch,
  withInterceptors,
} from '@angular/common/http';
import { API_URL } from '@e-commerce/client-web/shared/utils';
import { provideState, provideStore } from '@ngrx/store';
import { MessageService } from 'primeng/api';
import { AppInitializerProvider } from './utils/app-initializer';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideEffects } from '@ngrx/effects';
import {
  AuthEffects,
  authFeature,
  authInterceptor,
} from '@e-commerce/client-web/auth/data-access';
import { provideServiceWorker } from '@angular/service-worker';
import {
  CategoryEffect,
  categoryFeature,
} from '@e-commerce/client-web/shared/data-access';
import { provideStoreDevtools } from '@ngrx/store-devtools';

export const appConfig: ApplicationConfig = {
  providers: [
    provideExperimentalZonelessChangeDetection(),
    provideRouter(appRoutes),
    provideStore(),
    provideState(authFeature),
    provideState(categoryFeature),
    provideEffects([AuthEffects, CategoryEffect]),
    provideStoreDevtools({
      maxAge: 25,
      logOnly: !isDevMode(),
      autoPause: true,
      trace: false,
      traceLimit: 75,
      connectInZone: true,
    }),
    provideAnimationsAsync(),
    provideHttpClient(withFetch(), withInterceptors([authInterceptor])),
    {
      provide: API_URL,
      useValue: 'http://localhost:3000',
    },
    AppInitializerProvider,
    MessageService,
    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000',
    }),
  ],
};
