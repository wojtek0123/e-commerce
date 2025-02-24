import { computed, inject, Injectable } from '@angular/core';
import { AuthStore } from '@e-commerce/client-web/auth/data-access';
import { Tokens } from '@e-commerce/shared/api-models';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly authStore = inject(AuthStore);

  public readonly userId = computed(() => this.authStore.userId());
  public readonly isAuthenticated = computed(() =>
    this.authStore.isAuthenticated(),
  );
  public readonly refreshToken = computed(() => this.authStore.refreshToken());
  public readonly accessToken = computed(() => this.authStore.accessToken());

  public logout() {
    this.authStore.logout();
  }

  public updateTokens(tokens: Tokens) {
    this.authStore.updateTokens(tokens);
  }
}
