import { Tokens, User } from '@e-commerce/client-web/shared/data-access';

export interface AuthState {
  userId: User['id'] | null;
  accessToken: Tokens['accessToken'] | null;
  refreshToken: Tokens['refreshToken'] | null;
  loading: boolean;
  error: string | string[] | null;
  event: 'auth-success' | 'logout-success' | null;
}

export const initialAuthState: AuthState = {
  userId: null,
  accessToken: null,
  refreshToken: null,
  loading: false,
  error: null,
  event: null,
};
