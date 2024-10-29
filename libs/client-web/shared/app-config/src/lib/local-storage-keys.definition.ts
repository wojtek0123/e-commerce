import { InjectionToken, Provider } from '@angular/core';

type AppLocalStorageKeys = keyof typeof APP_LOCAL_STORAGE_KEYS;

export const APP_LOCAL_STORAGE_KEYS_TOKEN = new InjectionToken<
  Record<AppLocalStorageKeys, string>
>('App local storage keys');

const APP_LOCAL_STORAGE_KEYS = {
  REFRESH_TOKEN: 'refreshToken',
  ACCESS_TOKEN: 'accessToken',
  USER_ID: 'userId',
  IS_EXPANDED: 'isExpanded',
  THEME: 'isDark',
  CART: 'cart',
};

export const provideLocalStorageKeys: Provider = {
  provide: APP_LOCAL_STORAGE_KEYS_TOKEN,
  useValue: APP_LOCAL_STORAGE_KEYS,
};
