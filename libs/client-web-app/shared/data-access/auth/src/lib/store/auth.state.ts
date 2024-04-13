import {
  ApiStatus,
  User,
} from '@e-commerce/client-web-app/shared/data-access/api-types';

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
  user: User | null;
  tokens: {
    accessToken: string;
    refreshToken: string;
  } | null;
  status: ApiStatus;
  errorMessage: string | null;
}

export const initialState: AuthState = {
  user: null,
  tokens: null,
  status: 'idle',
  errorMessage: null,
};
