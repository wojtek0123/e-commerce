import { authFeature } from './auth.reducer';

const { selectStatus, selectErrorMessage } = authFeature;

export const authSelectors = {
  selectStatus,
  selectErrorMessage,
};
