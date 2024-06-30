import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { ApplicationConfig } from '@angular/core';
import { AppInitializerProvider } from './providers/app-initializer.provider';
import { authInterceptor } from './interceptors/auth.interceptor';
import { unAuthErrorInterceptor } from './interceptors/unauth-error.interceptor';
import { MessageService } from 'primeng/api';

export const shellConfig: ApplicationConfig = {
  providers: [
    MessageService,
    AppInitializerProvider,
    provideHttpClient(
      withInterceptors([authInterceptor, unAuthErrorInterceptor])
    ),
  ],
};
