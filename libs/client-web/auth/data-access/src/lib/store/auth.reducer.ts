import { createFeature, createReducer, on } from '@ngrx/store';
import { authActions } from './auth.actions';
import { initialAuthState, AuthState } from './auth.state';

export const authFeature = createFeature({
  name: 'auth',
  reducer: createReducer(
    initialAuthState,
    on(
      authActions.init,
      (state): AuthState => ({
        ...state,
      }),
    ),
    on(
      authActions.initSuccess,
      (state, { userId, tokens }): AuthState => ({
        ...state,
        ...tokens,
        userId,
      }),
    ),
    on(
      authActions.login,
      authActions.register,
      authActions.logout,
      (state): AuthState => ({
        ...state,
        loading: true,
      }),
    ),
    on(
      authActions.loginSuccess,
      authActions.registerSuccess,
      (state, { tokens, user }): AuthState => ({
        ...state,
        ...tokens,
        userId: user.id,
        loading: false,
        event: 'auth-success',
      }),
    ),
    on(
      authActions.loginFailure,
      authActions.registerFailure,
      (state, { error }): AuthState => ({
        ...state,
        error: error.message,
      }),
    ),
    on(
      authActions.logoutSuccess,
      (state): AuthState => ({
        ...state,
        loading: false,
        event: 'logout-success',
        userId: null,
        refreshToken: null,
        accessToken: null,
      }),
    ),
    on(
      authActions.refreshToken,
      (state, { refreshToken, userId }): AuthState => ({
        ...state,
        userId,
        refreshToken,
      }),
    ),
  ),
});
