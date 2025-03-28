import { ApiStatus } from '@e-commerce/client-web-app/shared/data-access/api-types';

export interface RegisterState {
  email: string | null;
  password: string | null;
  confirmPassword: string | null;
}

export interface LoginState {
  email: string | null;
  password: string | null;
}

export interface AuthState {
  accessToken: string | null;
  status: ApiStatus;
  errorMessage: string | null;
}

export const initialState: AuthState = {
  accessToken: null,
  status: 'idle',
  errorMessage: null,
};
