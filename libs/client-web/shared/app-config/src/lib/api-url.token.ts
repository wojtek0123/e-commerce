import { InjectionToken, Provider } from '@angular/core';

export const API_URL = new InjectionToken<string>('api url');

// export const provideApiUrl: Provider = {
// provide: API_URL,
// useValue: 'http://localhost:3000',
// useValue: 'https://e-commerce-api-usdu.onrender.com',
// };
