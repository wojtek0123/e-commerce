import { authFeature } from './auth.reducer';

const { selectStatus, selectErrorMessage, selectUser } = authFeature;

export const authSelectors = {
  selectStatus,
  selectErrorMessage,
  selectUser,
};
