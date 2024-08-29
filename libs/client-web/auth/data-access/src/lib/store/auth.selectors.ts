import { createSelector } from '@ngrx/store';
import { authFeature } from './auth.reducer';

export const {
  selectError,
  selectUserId,
  selectLoading,
  selectAccessToken,
  selectRefreshToken,
  selectEvent,
} = authFeature;

export const selectIsAuthenticated = createSelector(
  selectUserId,
  selectAccessToken,
  selectRefreshToken,
  (userId, accessToken, refreshToken) =>
    !!userId && !!accessToken && !!refreshToken,
);
