import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class UnauthorizedDialogService {
  #hidden = signal(true);
  #comebackUrl = signal<string | null>(null);

  hidden = this.#hidden.asReadonly();
  comebackUrl = this.#comebackUrl.asReadonly();

  show(comebackUrl?: string) {
    this.#hidden.set(false);
    this.#comebackUrl.set(comebackUrl ?? null);
  }

  close() {
    this.#hidden.set(true);
  }
}
