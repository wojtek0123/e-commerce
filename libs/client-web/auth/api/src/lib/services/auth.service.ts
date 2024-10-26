import { computed, inject, Injectable } from '@angular/core';
import { AuthStore } from '@e-commerce/client-web/auth/data-access';

@Injectable()
export class AuthService {
  private readonly authStore = inject(AuthStore);

  public readonly userId = computed(() => this.authStore.userId());
  public readonly event = computed(() => this.authStore.event());
  public readonly isAuthenticated = computed(() =>
    this.authStore.isAuthenticated(),
  );

  public logout() {
    this.authStore.logout();
  }
}
