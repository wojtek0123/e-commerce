import { authFeature } from './auth.reducer';

const { selectStatus, selectErrorMessage, selectUser, selectTokens } =
  authFeature;

export const authSelectors = {
  selectStatus,
  selectErrorMessage,
  selectUser,
  selectTokens,
};
