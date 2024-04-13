import { createActionGroup, emptyProps, props } from '@ngrx/store';
import {
  ResponseError,
  Session,
  User,
  Token,
} from '@e-commerce/client-web-app/shared/data-access/api-types';

export const authActions = createActionGroup({
  source: 'Auth',
  events: {
    init: emptyProps(),
    initSuccess: props<{ session: Session | null }>(),
    login: props<{ email: string; password: string; valid: boolean }>(),
    loginSuccess: props<Session>(),
    loginFailure: props<{ responseError: ResponseError }>(),
    register: props<{ email: string; password: string; valid: boolean }>(),
    registerSuccess: props<Session>(),
    registerFailure: props<{ responseError: ResponseError }>(),
    getRefreshToken: props<{ id: User['id']; refreshToken: string }>(),
    getRefreshTokenSuccess: props<Token>(),
    getRefreshTokenFailure: props<{ responseError: ResponseError }>(),
  },
});
