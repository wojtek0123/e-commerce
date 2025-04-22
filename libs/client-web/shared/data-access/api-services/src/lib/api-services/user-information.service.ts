import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { API_URL } from '@e-commerce/client-web/shared/app-config';
import { UserInformation } from '@e-commerce/shared/api-models';

@Injectable({ providedIn: 'root' })
export class UserInformationApiService {
  private http = inject(HttpClient);
  private apiUrl = inject(API_URL);

  get$() {
    return this.http.get<UserInformation>(`${this.apiUrl}/user-informations`);
  }
}
