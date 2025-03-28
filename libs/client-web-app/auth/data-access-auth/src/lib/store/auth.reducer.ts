import { createFeature, createReducer, on } from '@ngrx/store';
import {
  AuthState,
  LoginState,
  RegisterState,
  initialState,
} from './auth.state';
import { authActions } from './auth.actions';

export const authFeature = createFeature({
  name: 'auth',
  reducer: createReducer(
    initialState,
    on(
      authActions.login,
      (state): AuthState => ({
        ...state,
        status: 'loading',
      })
    ),
    on(
      authActions.loginSuccess,
      (state, { accessToken }): AuthState => ({
        ...state,
        accessToken,
        status: 'ok',
      })
    ),
    on(
      authActions.loginFailure,
      (state, { error }): AuthState => ({
        ...state,
        status: 'error',
      })
    ),
    on(
      authActions.register,
      (state): AuthState => ({
        ...state,
        status: 'loading',
      })
    ),
    on(
      authActions.registerSuccess,
      (state, { accessToken }): AuthState => ({
        ...state,
        accessToken,
        status: 'ok',
      })
    ),
    on(
      authActions.registerFailure,
      (state, { error }): AuthState => ({
        ...state,
        status: 'error',
      })
    )
  ),
});
