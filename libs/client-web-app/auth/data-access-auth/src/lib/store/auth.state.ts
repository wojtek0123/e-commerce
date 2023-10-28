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
  //   forms: {
  //     register: FormGroupState<RegisterState>;
  //     login: FormGroupState<LoginState>;
  //   };
}

export const initialState: AuthState = {
  accessToken: null,
  // forms: {
  //   register: createFormGroupState<RegisterState>('register', {
  //     email: null,
  //     password: null,
  //     confirmPassword: null,
  //   }),
  //   login: createFormGroupState<LoginState>('login', {
  //     email: null,
  //     password: null,
  //   }),
  // },
};
