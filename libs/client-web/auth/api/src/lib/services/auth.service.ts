import { inject, Injectable } from '@angular/core';
import { AuthStore } from '@e-commerce/client-web/auth/data-access';

@Injectable()
export class AuthService {
  private readonly authStore = inject(AuthStore);

  public readonly userId = this.authStore.userId;
}
