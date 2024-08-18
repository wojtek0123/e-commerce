import {
  ApplicationConfig,
  provideExperimentalZonelessChangeDetection,
  isDevMode,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { appRoutes } from './app.routes';
import {
  authInterceptor,
  unAuthErrorInterceptor,
} from '@e-commerce/client-web/auth/utils';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { API_URL } from '@e-commerce/client-web/shared/utils';
import { provideState, provideStore } from '@ngrx/store';
import { MessageService } from 'primeng/api';
import { AppInitializerProvider } from './utils/app-initializer';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideEffects } from '@ngrx/effects';
import {
  AuthEffects,
  authFeature,
} from '@e-commerce/client-web/auth/data-access';
import { provideServiceWorker } from '@angular/service-worker';
import {
  ShoppingSessionEffect,
  shoppingSessionFeature,
} from '@e-commerce/client-web/cart/data-access';
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
    provideState(shoppingSessionFeature),
    provideState(categoryFeature),
    provideEffects([AuthEffects, ShoppingSessionEffect, CategoryEffect]),
    provideStoreDevtools({
      maxAge: 25, // Retains last 25 states
      logOnly: !isDevMode(), // Restrict extension to log-only mode
      autoPause: true, // Pauses recording actions and state changes when the extension window is not open
      trace: false, //  If set to true, will include stack trace for every dispatched action, so you can see it in trace tab jumping directly to that part of code
      traceLimit: 75, // maximum stack trace frames to be stored (in case trace option was provided as true)
      connectInZone: true, // If set to true, the connection is established within the Angular zone
    }),
    provideAnimationsAsync(),
    provideHttpClient(
      withInterceptors([authInterceptor, unAuthErrorInterceptor]),
    ),
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
