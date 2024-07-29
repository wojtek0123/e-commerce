import {
  DestroyRef,
  Injectable,
  computed,
  inject,
  signal,
} from '@angular/core';
import {
  ResponseError,
  Session,
  Tokens,
  User,
} from '@e-commerce/client-web-app/shared/data-access/api-types';
import { appRouterConfig } from '@e-commerce/client-web-app/shared/utils/router-config';
import { AuthApiService } from './auth-api.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MessageService } from 'primeng/api';
import { CartService } from '@e-commerce/client-web-app/shared/data-access/cart';
import { take } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private router = inject(Router);
  private authApi = inject(AuthApiService);
  private messageService = inject(MessageService);
  private destroyRef = inject(DestroyRef);
  private cartService = inject(CartService);
  private route = inject(ActivatedRoute);

  private _userId = signal<User['id'] | null>(null);
  private _tokens = signal<Tokens | null>(null);
  private _loading = signal(false);

  public userId = this._userId.asReadonly();
  public tokens = this._tokens.asReadonly();
  public loading = this._loading.asReadonly();
  public isAuthenticated = computed(() => !!this.userId() && !!this.tokens());

  setSession({ tokens, user }: Session) {
    localStorage.setItem(
      appRouterConfig.localStorage.accessToken,
      tokens.accessToken,
    );
    localStorage.setItem(
      appRouterConfig.localStorage.refreshToken,
      tokens.refreshToken,
    );
    localStorage.setItem(
      appRouterConfig.localStorage.userId,
      user.id.toString(),
    );

    this._userId.set(user.id);
    this._tokens.set(tokens);
  }

  removeSession() {
    localStorage.removeItem(appRouterConfig.localStorage.accessToken);
    localStorage.removeItem(appRouterConfig.localStorage.refreshToken);
    localStorage.removeItem(appRouterConfig.localStorage.userId);

    this._userId.set(null);
    this._tokens.set(null);
  }

  updateTokens({ accessToken, refreshToken }: Session['tokens']) {
    localStorage.setItem(appRouterConfig.localStorage.accessToken, accessToken);
    localStorage.setItem(
      appRouterConfig.localStorage.refreshToken,
      refreshToken,
    );

    this._tokens.set({ accessToken, refreshToken });
  }

  getSession() {
    const accessToken = localStorage.getItem(
      appRouterConfig.localStorage.accessToken,
    );
    const refreshToken = localStorage.getItem(
      appRouterConfig.localStorage.refreshToken,
    );
    const userId = localStorage.getItem(appRouterConfig.localStorage.userId);

    if (accessToken && refreshToken && userId) {
      this._userId.set(Number(userId));
      this._tokens.set({
        accessToken,
        refreshToken,
      });
    }
    this.cartService.getCartItems();
  }

  login(email: string, password: string) {
    this._loading.set(true);

    this.authApi
      .login$(email, password)
      .pipe(take(1), takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: ({ user, tokens }) => {
          this._loading.set(false);
          this.messageService.add({
            severity: 'success',
            detail: 'You have been logged in',
            summary: 'Success',
          });
          this.setSession({ user, tokens });
          this.cartService.syncDatabase();

          this.router.navigate([this._returnUrl() ?? '/']);
        },
        error: (resError: ResponseError) => {
          this._loading.set(false);
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
      .pipe(take(1), takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: ({ user, tokens }) => {
          this._loading.set(false);
          this.messageService.add({
            severity: 'success',
            detail: 'You have been registered',
            summary: 'Success',
          });
          this.setSession({ user, tokens });
          this.cartService.syncDatabase();
          this.router.navigate([this._returnUrl() ?? '/']);
        },
        error: (resError: ResponseError) => {
          this._loading.set(false);
          this.messageService.add({
            severity: 'error',
            detail: resError.error.message || 'Error occur while signing in',
            summary: 'Error',
          });
        },
      });
  }

  logout(userId?: User['id']) {
    if (!this._userId()) return;

    this._loading.set(true);

    this.authApi
      .logout$(userId ?? this._userId()!)
      .pipe(take(1), takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.removeSession();
          this._loading.set(false);
          this.cartService.clear();

          this.messageService.add({
            severity: 'success',
            detail: 'You have been logged out',
            summary: 'Success',
          });

          // TODO: navigate to home only when user is on protected by auth guard route
          this.router.navigate(['/']);
        },
        error: (resError: ResponseError) => {
          this._loading.set(false);

          this.messageService.add({
            severity: 'error',
            detail: resError.error.message || 'Error occur while logging out',
            summary: 'Error',
          });
        },
      });
  }

  setTokens(tokens: Tokens) {
    localStorage.setItem(
      appRouterConfig.localStorage.refreshToken,
      tokens.refreshToken,
    );
    localStorage.setItem(
      appRouterConfig.localStorage.accessToken,
      tokens.accessToken,
    );

    this._tokens.set(tokens);
  }

  refreshToken$(userId: User['id'], refreshToken: Tokens['refreshToken']) {
    return this.authApi.getRefreshToken$(userId, refreshToken);
  }

  private _returnUrl() {
    const isReturnToOrderProcessActive =
      this.route.snapshot.queryParams['returnToOrderProcess'] ?? false;

    if (isReturnToOrderProcessActive) {
      return '/order';
    }

    return null;
  }
}
