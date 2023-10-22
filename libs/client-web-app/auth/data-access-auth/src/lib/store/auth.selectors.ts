import { createSelector } from '@ngrx/store';
import { authFeature } from './auth.reducer';

export const { selectAuthState } = authFeature;

export const selectRegisterForm = createSelector(
  selectAuthState,
  (state) => state.forms.register
);
export const selectLoginForm = createSelector(
  selectAuthState,
  (state) => state.forms.login
);
