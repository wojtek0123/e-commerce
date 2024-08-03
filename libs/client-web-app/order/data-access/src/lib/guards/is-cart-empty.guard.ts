import { CanActivateFn } from '@angular/router';

export const isCartEmptyGuard: CanActivateFn = () => {
  // TODO: przy inicjalizacji itemy z koszyka są pobrane po sprawdzeniu w tym guardzie, więc zawsze jest false

  // TODO: co z niezalogowanym użytkownikiem
  return true;
};
