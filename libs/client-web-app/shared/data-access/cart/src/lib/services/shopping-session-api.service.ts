import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { ShoppingSession } from '@e-commerce/client-web-app/shared/data-access/api-types';
import { shareReplay } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ShoppingSessionApiService {
  private http = inject(HttpClient);

  getShoppingSession() {
    return this.http
      .get<ShoppingSession>('http://localhost:3000/shopping-sessions')
      .pipe(shareReplay(1));
  }
}
