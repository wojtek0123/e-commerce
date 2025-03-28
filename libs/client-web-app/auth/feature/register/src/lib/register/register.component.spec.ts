import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup } from '@angular/forms';
import { provideMockStore } from '@ngrx/store/testing';
import { initialState } from '@e-commerce/client-web-app/auth/data-access-auth';
import { ActivatedRoute } from '@angular/router';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { RegisterComponent } from './register.component';

describe('ClientWebAppAuthFeatureRegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterComponent],
      providers: [
        provideMockStore({ initialState }),
        {
          provide: ActivatedRoute,
          useValue: {
            params: '',
          },
        },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should matchPassword method return null', () => {
    const formGroup = new FormGroup({
      password: new FormControl('test'),
      confirmPassword: new FormControl('test'),
    });
    const matchPasswordError = component.matchPassword()(formGroup);
    expect(matchPasswordError).toBe(null);
  });

  it('should matchPassword method return error ', () => {
    const formGroup = new FormGroup({
      password: new FormControl('test'),
      confirmPassword: new FormControl(''),
    });
    const matchPasswordError = component.matchPassword()(formGroup);
    expect(matchPasswordError).not.toBe(null);
    expect(matchPasswordError).toStrictEqual({ passwordMismatch: true });
  });

  it('should change "submitted" property to true', () => {
    component.onRegister();
    expect(component.submitted).toBe(true);
  });

  it('should not dispatch when form is invalid', () => {
    const spyDispatch = jest.spyOn(component['store'], 'dispatch');
    component.onRegister();

    expect(component.registerForm.invalid).toBeTruthy();
    expect(spyDispatch).not.toBeCalled();
  });

  it('should dispatch when form is valid', () => {
    const spyDispatch = jest.spyOn(component['store'], 'dispatch');
    const registerFormControls = component.registerForm.controls;

    registerFormControls.email.setValue('test@test.com');
    registerFormControls.passwords.controls.password.setValue('password');
    registerFormControls.passwords.controls.confirmPassword.setValue(
      'password'
    );

    component.onRegister();

    expect(component.registerForm.valid).toBeTruthy();
    expect(spyDispatch).toBeCalledTimes(1);
  });

  it('test a form group element count', () => {
    const inputElements =
      fixture.debugElement.nativeElement.querySelectorAll('input');
    expect(inputElements.length).toEqual(3);
  });

  it('check initial form values for register form group', () => {
    const registerFormGroup = component.registerForm;
    const registerFormValues = {
      email: '',
      passwords: {
        password: '',
        confirmPassword: '',
      },
    };
    expect(registerFormGroup.value).toEqual(registerFormValues);
  });

  it('check email, password and confirmPassword value before entering some value and validation', () => {
    const registerForm =
      fixture.debugElement.nativeElement.querySelectorAll('input');

    const emailInput = registerForm[0];
    const passwordInput = registerForm[1];
    const confirmPasswordInput = registerForm[2];

    const emailControl = component.registerForm.get('email');
    const passwordsGroup = component.registerForm.get('passwords');
    const passwordControl = component.registerForm
      .get('passwords')
      ?.get('password');
    const confirmPasswordControl = component.registerForm
      .get('passwords')
      ?.get('confirmPassword');

    expect(emailInput.value).toEqual(emailControl?.value);
    expect(emailControl?.errors).not.toBeNull();
    expect(emailControl?.errors?.['required']).toBeTruthy();

    expect(passwordInput.value).toEqual(emailControl?.value);
    expect(passwordControl?.errors).not.toBeNull();
    expect(passwordControl?.errors?.['required']).toBeTruthy();

    expect(confirmPasswordInput.value).toEqual(emailControl?.value);
    expect(confirmPasswordControl?.errors).not.toBeNull();
    expect(confirmPasswordControl?.errors?.['required']).toBeTruthy();

    expect(passwordsGroup?.errors).toBeNull();
    expect(passwordsGroup?.errors?.['passwordMismatch']).toBeFalsy();
  });

  it('check email validators for email control', () => {
    const invalidEmailExamples = [
      'plainaddress',
      '#@%^%#$@#$@#.com',
      '@example.com',
      'Joe Smith <email@example.com>',
      'email.example.com',
      'email@example@example.com',
      '.email@example.com',
      'email.@example.com',
      'email..email@example.com',
      'あいうえお@example.com',
      'email@example.com (Joe Smith)',
      'email@-example.com',
      'email@example..com',
      'Abc..123@example.com',
      'email@[123.123.123.123]',
      `“email”@example.com`,
    ];

    const validEmailExamples = [
      'email@example.com',
      'firstname.lastname@example.com',
      'email@subdomain.example.com',
      'firstname+lastname@example.com',
      'email@123.123.123.123',
      '1234567890@example.com',
      'email@example-one.com',
      '_______@example.com',
      'email@example.name',
      'email@example.museum',
      'email@example.co.jp',
      'firstname-lastname@example.com',
    ];

    const emailControl = component.registerForm.get('email');

    invalidEmailExamples.map((email) => {
      emailControl?.setValue(email);

      expect(emailControl?.errors).not.toBeNull();
      expect(emailControl?.errors?.['email']).toBeTruthy();
    });

    validEmailExamples.forEach((email) => {
      emailControl?.setValue(email);

      expect(emailControl?.errors).toBeNull();
      expect(emailControl?.errors?.['email']).toBeUndefined();
    });
  });

  it('check min length validators for password', () => {
    const passwordControl = component.registerForm
      .get('passwords')
      ?.get('password');

    passwordControl?.setValue('test');

    expect(passwordControl?.value).toBe('test');
    expect(passwordControl?.errors).not.toBeNull();
    expect(passwordControl?.errors?.['minlength']).toBeTruthy();

    passwordControl?.setValue('test12');

    expect(passwordControl?.value).toBe('test12');
    expect(passwordControl?.errors).toBeNull();
    expect(passwordControl?.errors?.['minlength']).toBeUndefined();
  });

  it('should get passwordsControls return passwords group controls', () => {
    const passwordsGroup = component.registerForm.get('passwords');

    expect(passwordsGroup?.get('password')).toEqual(
      component.passwordsControls.password
    );
    expect(passwordsGroup?.get('confirmPassword')).toEqual(
      component.passwordsControls.confirmPassword
    );
  });

  it('check register form is valid when validators are fulfilled', () => {
    const registerForm = component.registerForm;

    registerForm.controls.email.setValue('test@test.pl');
    registerForm.controls.passwords.controls.password.setValue('password');
    registerForm.controls.passwords.controls.confirmPassword.setValue(
      'password'
    );

    expect(registerForm.errors).toBeNull();
  });
});
