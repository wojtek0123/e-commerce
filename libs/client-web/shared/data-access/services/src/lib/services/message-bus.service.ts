import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class MessageBusService {
  #event = signal<MessageEvent | null>(null);

  event = this.#event.asReadonly();

  setEvent(event: MessageEvent) {
    this.#event.set(event);
  }
}

type MessageEvent =
  | 'init-local'
  | 'init-database'
  | 'auth-success'
  | 'logout-success'
  | 'checkout-success';
