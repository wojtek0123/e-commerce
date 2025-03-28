import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { ResponseError } from '@e-commerce/client-web-app/shared/data-access/api-types';

export const authActions = createActionGroup({
  source: 'Auth',
  events: {
    login: props<{ email: string; password: string; valid: boolean }>(),
    loginSuccess: props<{ accessToken: string }>(),
    loginFailure: props<{ responseError: ResponseError }>(),
    register: props<{ email: string; password: string; valid: boolean }>(),
    registerSuccess: props<{ accessToken: string }>(),
    registerFailure: props<{ responseError: ResponseError }>(),
    clearForm: props<{ formId: 'login' | 'register' }>(),
    markFormAsSubmitted: props<{ formId: 'login' | 'register' }>(),
    init: emptyProps(),
  },
});
