import { createFeature, createReducer, on } from '@ngrx/store';
import { authActions } from './auth.actions';
import { AuthState, initialState } from './auth.state';

export const authFeature = createFeature({
  name: 'auth',
  reducer: createReducer(
    initialState,
    on(
      authActions.initSuccess,
      (state, { session }): AuthState => ({
        ...state,
        tokens: session?.tokens ?? null,
        user: session?.user ?? null,
      })
    ),
    on(
      authActions.login,
      (state, { valid }): AuthState => ({
        ...state,
        status: valid ? 'loading' : 'error',
      })
    ),
    on(
      authActions.loginSuccess,
      (state, { tokens, user }): AuthState => ({
        ...state,
        tokens,
        user,
        status: 'ok',
      })
    ),
    on(
      authActions.loginFailure,
      (state, { responseError }): AuthState => ({
        ...state,
        status: 'error',
        errorMessage: responseError.error.message,
      })
    ),
    on(
      authActions.register,
      (state, { valid }): AuthState => ({
        ...state,
        status: valid ? 'loading' : 'error',
      })
    ),
    on(
      authActions.registerSuccess,
      (state, { tokens, user }): AuthState => ({
        ...state,
        tokens,
        user,
        status: 'ok',
      })
    ),
    on(
      authActions.registerFailure,
      (state, { responseError }): AuthState => ({
        ...state,
        status: 'error',
        errorMessage: responseError.error.message,
      })
    ),
    on(
      authActions.logout,
      (state): AuthState => ({
        ...state,
        status: 'loading',
      })
    ),
    on(
      authActions.logoutSuccess,
      (state): AuthState => ({
        ...state,
        tokens: null,
        user: null,
        status: 'ok',
      })
    ),
    on(
      authActions.logoutFailure,
      (state, { responseError }): AuthState => ({
        ...state,
        status: 'error',
        errorMessage: responseError.error.message,
      })
    ),
    on(
      authActions.getRefreshToken,
      (state): AuthState => ({
        ...state,
        status: 'loading',
      })
    ),
    on(
      authActions.getRefreshTokenSuccess,
      (state, { tokens }): AuthState => ({
        ...state,
        status: 'ok',
        tokens,
      })
    ),
    on(
      authActions.getRefreshTokenFailure,
      (state, { responseError }): AuthState => ({
        ...state,
        status: 'error',
        tokens: null,
        errorMessage: responseError.error.message,
      })
    )
  ),
});
