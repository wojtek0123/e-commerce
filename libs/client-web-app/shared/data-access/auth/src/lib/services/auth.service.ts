import { DestroyRef, Injectable, inject, signal } from '@angular/core';
import { AuthApiService } from './auth-api.service';
import {
  ResponseError,
  Tokens,
  User,
} from '@e-commerce/client-web-app/shared/data-access/api-types';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MessageService } from 'primeng/api';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private authApi = inject(AuthApiService);
  private messageService = inject(MessageService);
  private destroyRef = inject(DestroyRef);

  private _user = signal<User | null>(null);
  private _tokens = signal<Tokens | null>(null);
  private _loading = signal(false);

  public user = this._user.asReadonly();
  public tokens = this._tokens.asReadonly();
  public loading = this._loading.asReadonly();

  init() {
    const session = this.authApi.getSession();
    this._user.set(session?.user ?? null);
    this._tokens.set(session?.tokens ?? null);
  }

  login(email: string, password: string) {
    this._loading.set(true);

    this.authApi
      .login$(email, password)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: ({ user, tokens }) => {
          this._user.set(user);
          this._tokens.set(tokens);
          this._loading.set(false);
          this.messageService.add({
            severity: 'success',
            detail: 'You have been logged in',
            summary: 'Success',
          });
        },
        error: (resError: ResponseError) => {
          this.messageService.add({
            severity: 'error',
            detail: resError.error.message || 'Error occur while logging in',
            summary: 'Error',
          });
        },
      });
  }

  register(email: string, password: string) {
    this._loading.set(true);

    this.authApi
      .register$(email, password)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: ({ user, tokens }) => {
          this._user.set(user);
          this._tokens.set(tokens);
          this._loading.set(false);
          this.messageService.add({
            severity: 'success',
            detail: 'You have been registered',
            summary: 'Success',
          });
        },
        error: (resError: ResponseError) => {
          this.messageService.add({
            severity: 'error',
            detail: resError.error.message || 'Error occur while signing in',
            summary: 'Error',
          });
        },
      });
  }

  refreshToken(userId: User['id'], refreshToken: Tokens['refreshToken']) {
    this.authApi
      .getRefreshToken$(userId, refreshToken)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (tokens) => {
          this._tokens.set(tokens);
        },
        error: () => {
          this.authApi.removeSession();
        },
      });
  }

  logout(userId?: User['id']) {
    this._loading.set(true);
    if (!this._user()) return;
    this.authApi
      .logout$(userId ?? this._user()!.id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.authApi.removeSession();
          // this.cartService.syncLocalstorage();
          this.messageService.add({
            severity: 'success',
            detail: 'You have been logged out',
            summary: 'Success',
          });
        },
      });
  }

  setTokens(tokens: Tokens) {
    this._tokens.set(tokens);
  }
}
