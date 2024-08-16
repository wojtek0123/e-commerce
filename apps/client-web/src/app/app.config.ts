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

export const appConfig: ApplicationConfig = {
  providers: [
    provideExperimentalZonelessChangeDetection(),
    provideRouter(appRoutes),
    provideStore(),
    provideState(authFeature),
    provideState(shoppingSessionFeature),
    provideEffects([AuthEffects, ShoppingSessionEffect]),
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
