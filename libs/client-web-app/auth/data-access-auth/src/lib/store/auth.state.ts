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
  status: 'idle' | 'loading' | 'ok' | 'error';
}

export const initialState: AuthState = {
  accessToken: null,
  status: 'idle',
};
