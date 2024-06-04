import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { ApplicationConfig } from '@angular/core';
import {
  AuthService,
  AuthStore,
} from '@e-commerce/client-web-app/shared/data-access/auth';
import {
  CategoryStore,
  CategoryApiService,
} from '@e-commerce/client-web-app/shared/data-access/category';
import { AppInitializerProvider } from './providers/app-initializer.provider';
import { authInterceptor } from './interceptors/auth.interceptor';
import { unAuthErrorInterceptor } from './interceptors/unauth-error.interceptor';
import { MessageService } from 'primeng/api';

export const shellConfig: ApplicationConfig = {
  providers: [
    AuthService,
    CategoryApiService,
    MessageService,
    AppInitializerProvider,
    provideHttpClient(
      withInterceptors([authInterceptor, unAuthErrorInterceptor])
    ),
    AuthStore,
    CategoryStore,
  ],
};
