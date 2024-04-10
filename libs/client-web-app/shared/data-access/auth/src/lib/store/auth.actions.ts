import { createActionGroup, emptyProps, props } from '@ngrx/store';
import {
  ResponseError,
  User,
  Session,
} from '@e-commerce/client-web-app/shared/data-access/api-types';

export const authActions = createActionGroup({
  source: 'Auth',
  events: {
    init: emptyProps(),
    initSuccess: props<{ session: Session | null }>(),
    login: props<{ email: string; password: string; valid: boolean }>(),
    loginSuccess: props<{ accessToken: string; user: User }>(),
    loginFailure: props<{ responseError: ResponseError }>(),
    register: props<{ email: string; password: string; valid: boolean }>(),
    registerSuccess: props<{ accessToken: string; user: User }>(),
    registerFailure: props<{ responseError: ResponseError }>(),
  },
});
