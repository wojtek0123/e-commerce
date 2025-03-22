import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class MessageBusService {
  #event$ = new ReplaySubject();

  event$ = this.#event$.asObservable();

  setEvent(event: MessageEvent) {
    this.#event$.next(event);
  }
}

type MessageEvent =
  | 'init-local'
  | 'init-database'
  | 'auth-success'
  | 'logout-success'
  | 'checkout-success';
