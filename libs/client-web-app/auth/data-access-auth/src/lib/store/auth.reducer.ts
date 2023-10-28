import { createFeature, createReducer, on } from '@ngrx/store';
import { LoginState, RegisterState, initialState } from './auth.state';
import { authActions } from './auth.actions';

export const authFeature = createFeature({
  name: 'auth',
  reducer: createReducer(
    initialState,
    on(authActions.login, (state) => ({
      ...state,
      // forms: {
      //   ...state.forms,
      //   login: markAsSubmitted(state.forms.login),
      // },
    })),
    on(authActions.loginSuccess, (state, { accessToken }) => ({
      ...state,
      accessToken,
    })),
    on(authActions.register, (state) => ({
      ...state,
      // forms: {
      //   ...state.forms,
      //   register: markAsSubmitted(state.forms.register),
      // },
    })),
    on(authActions.registerSuccess, (state, { accessToken }) => ({
      ...state,
      accessToken,
    })),
    on(authActions.clearForm, (state, { formId }) => ({
      ...state,
      // forms: {
      // ...state.forms,
      // [formId]: initialState.forms[formId],
      // },
    })),
    on(authActions.markFormAsSubmitted, (state, { formId }) => ({
      ...state,
      // forms: {
      //   ...state.forms,
      //   [formId]: markAsSubmitted(state.forms[formId]),
      // },
    }))
    // onNgrxForms(),
    // onNgrxFormsAction(SetValueAction, (state, action) => {
    //   const registerForm = validateRegisterForm(
    //     formGroupReducer(state.forms.register, action)
    //   );
    //   const loginForm = validateLoginForm(
    //     formGroupReducer(state.forms.login, action)
    //   );

    //   if (registerForm !== state.forms.register) {
    //     state = {
    //       ...state,
    //       forms: {
    //         ...state.forms,
    //         register: markAsDirty(markAsTouched(registerForm)),
    //       },
    //     };
    //   }

    //   if (loginForm !== state.forms.login) {
    //     return {
    //       ...state,
    //       forms: {
    //         ...state.forms,
    //         login: markAsDirty(markAsTouched(loginForm)),
    //       },
    //     };
    //   }

    //   return state;
    // })
  ),
});

// export const validateRegisterForm = updateGroup<RegisterState>({
//   email: validate([required, email]),
//   password: validate([required, minLength(6)]),
//   confirmPassword: (confirmPassword, form) => {
//     return validate(confirmPassword, [required, equalTo(form.value.password)]);
//   },
// });

// export const validateLoginForm = updateGroup<LoginState>({
//   email: validate([required, email]),
//   password: validate(required),
// });
