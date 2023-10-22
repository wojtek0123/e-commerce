import { createActionGroup, emptyProps, props } from '@ngrx/store';

export const authActions = createActionGroup({
  source: 'Auth',
  events: {
    login: emptyProps(),
    loginSuccess: props<{ accessToken: string }>(),
    loginFailure: props<{ error: Error }>(),
    register: emptyProps(),
    registerSuccess: props<{ accessToken: string }>(),
    registerFailure: props<{ error: Error }>(),
    clearForm: props<{ formId: 'login' | 'register' }>(),
    markFormAsSubmitted: props<{ formId: 'login' | 'register' }>(),
    init: emptyProps(),
  },
});
