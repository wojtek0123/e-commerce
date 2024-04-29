import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { ApplicationConfig } from '@angular/core';
import {
  AuthService,
  AuthStore,
  // authFeature,
  // authEffects,
} from '@e-commerce/client-web-app/shared/data-access/auth';
import {
  categoryFeature,
  categoryEffects,
  CategoryApiService,
} from '@e-commerce/client-web-app/shared/data-access/category';
import { provideEffects } from '@ngrx/effects';
import { provideState } from '@ngrx/store';
import { AppInitializerProvider } from './providers/app-initializer.provider';
import { authInterceptor } from './interceptors/auth.interceptor';
import { unAuthErrorInterceptor } from './interceptors/unauth-error.interceptor';

export const shellConfig: ApplicationConfig = {
  providers: [
    AuthService,
    CategoryApiService,
    AppInitializerProvider,
    provideHttpClient(
      withInterceptors([authInterceptor, unAuthErrorInterceptor])
    ),
    AuthStore,
    // provideState(authFeature),
    provideState(categoryFeature),
    provideEffects([categoryEffects]),
  ],
};
