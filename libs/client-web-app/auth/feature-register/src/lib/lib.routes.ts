import { Route } from '@angular/router';
import { FeatureRegisterComponent } from './feature-register/feature-register.component';
import { provideState } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import {
  authEffects,
  authFeature,
} from '@e-commerce/client-web-app/auth/data-access-auth';
import { AuthService } from '@e-commerce/client-web-app/auth/data-access-auth';
import { LoginFormComponent } from './feature-register/login-form/login-form.component';
import { RegisterFormComponent } from './feature-register/register-form/register-form.component';

export const featureRegisterRoutes: Route[] = [
  {
    path: '',
    component: FeatureRegisterComponent,
    children: [
      {
        path: 'sign-in',
        component: LoginFormComponent,
      },
      {
        path: 'sign-up',
        component: RegisterFormComponent,
      },
    ],
    providers: [
      provideState(authFeature),
      provideEffects(authEffects),
      AuthService,
    ],
  },
];
