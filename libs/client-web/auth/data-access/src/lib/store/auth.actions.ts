import { createActionGroup, emptyProps, props } from '@ngrx/store';
import {
  ResponseError,
  Tokens,
  User,
} from '@e-commerce/client-web/shared/data-access';

export const authActions = createActionGroup({
  source: 'auth',
  events: {
    init: emptyProps(),
    initSuccess: props<{ tokens: Tokens; userId: User['id'] }>(),
    initFailure: emptyProps(),

    login: props<{ email: string; password: string }>(),
    loginSuccess: props<{ tokens: Tokens; user: User }>(),
    loginFailure: props<{ error: ResponseError }>(),

    register: props<{ email: string; password: string }>(),
    registerSuccess: props<{ tokens: Tokens; user: User }>(),
    registerFailure: props<{ error: ResponseError }>(),

    refreshToken: props<{
      userId: User['id'];
      refreshToken: Tokens['refreshToken'];
    }>(),
    refreshTokenSuccess: props<{
      accessToken: Tokens['accessToken'];
      refreshToken: Tokens['refreshToken'];
    }>(),
    refreshTokenFailure: props<{ error: ResponseError }>(),

    logout: emptyProps(),
    logoutSuccess: emptyProps(),
    logoutFailure: props<{ error: ResponseError }>(),
  },
});
