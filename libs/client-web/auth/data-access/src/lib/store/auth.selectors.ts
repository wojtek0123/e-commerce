import { authFeature } from './auth.reducer';

export const {
  selectError,
  selectUserId,
  selectLoading,
  selectAccessToken,
  selectRefreshToken,
} = authFeature;
