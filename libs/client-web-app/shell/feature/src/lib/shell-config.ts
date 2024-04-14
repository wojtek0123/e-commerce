import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { ApplicationConfig } from '@angular/core';
import {
  AuthService,
  authFeature,
  authEffects,
} from '@e-commerce/client-web-app/shared/data-access/auth';
import { provideEffects } from '@ngrx/effects';
import { provideState } from '@ngrx/store';
import {
  authInterceptor,
  unAuthErrorInterceptor as unAuthErrorInterceptor,
  AppInitializerProvider,
} from '@e-commerce/utils';

export const shellConfig: ApplicationConfig = {
  providers: [
    AuthService,
    AppInitializerProvider,
    provideHttpClient(
      withInterceptors([authInterceptor, unAuthErrorInterceptor])
    ),
    provideState(authFeature),
    provideEffects([authEffects]),
  ],
};
