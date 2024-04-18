import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { ApplicationConfig } from '@angular/core';
import {
  AuthService,
  authFeature,
  authEffects,
} from '@e-commerce/client-web-app/shared/data-access/auth';
import {
  categoryFeature,
  categoryEffects,
  CategoryApiService,
} from '@e-commerce/client-web-app/shared/data-access/category';
import { provideEffects } from '@ngrx/effects';
import { provideState } from '@ngrx/store';
import {
  authInterceptor,
  unAuthErrorInterceptor as unAuthErrorInterceptor,
  AppInitializerProvider,
} from '@e-commerce/client-web-app/shell/utils';

export const shellConfig: ApplicationConfig = {
  providers: [
    AuthService,
    CategoryApiService,
    AppInitializerProvider,
    provideHttpClient(
      withInterceptors([authInterceptor, unAuthErrorInterceptor])
    ),
    provideState(authFeature),
    provideState(categoryFeature),
    provideEffects([authEffects, categoryEffects]),
  ],
};
