import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ShoppingSessionApiService {
  private http = inject(HttpClient);

  delete() {
    return this.http.delete<unknown>('http://localhost:3000/shopping-sessions');
  }
}
