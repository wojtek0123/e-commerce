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
    on(authActions.refreshToken, (state, { refreshToken, userId }) => ({
      ...state,
      userId,
      refreshToken,
    })),
  ),
});
