import { InjectionToken, Provider } from '@angular/core';

type AppRoutePathsKeys = keyof typeof APP_ROUTE_PATHS;

export const APP_ROUTE_PATHS_TOKEN = new InjectionToken<
  Record<AppRoutePathsKeys, (param?: string) => string>
>('App routes');

export const APP_ROUTES_PARAMS = {
  BROWSE_BOOK_ID: 'bookId',
  PAYMENT_STATUS_ORDER_DETAILS_ID: 'orderDetailsId',
} as const;

export const APP_QUERY_PARAMS = {
  REDIRECT_TO: 'redirectTo',
} as const;

export const APP_ROUTES_FEATURE = {
  HOME: {
    BASE: '',
  } as const,
  AUTH: {
    BASE: 'auth',
    LOGIN: 'login',
    REGISTER: 'register',
  } as const,
  BROWSE: {
    BASE: 'browse',
    BOOKS: 'books',
    BOOK: 'book',
  } as const,
  ACCOUNT: {
    BASE: 'account',
    ORDERS: 'orders',
    INFORMATION: 'information',
    FAVOURITE_BOOKS_LIST: 'favourite-books-list',
  } as const,
  CART: {
    BASE: 'cart',
    ORDER_PROCESS: 'order-process',
    ORDER_SUMMARY: 'order-summary',
    PAYMENT_STATUS: 'payment-status',
  } as const,
  SUPPORT: {
    BASE: 'support',
    FAQ: 'faq',
  },
} as const;

const AUTH_FEATURE_PATHS = {
  LOGIN: () =>
    `/${APP_ROUTES_FEATURE.AUTH.BASE}/${APP_ROUTES_FEATURE.AUTH.LOGIN}`,
  REGISTER: () =>
    `/${APP_ROUTES_FEATURE.AUTH.BASE}/${APP_ROUTES_FEATURE.AUTH.REGISTER}`,
} as const;

const BROWSE_FEATURE_PATHS = {
  BOOKS: () =>
    `/${APP_ROUTES_FEATURE.BROWSE.BASE}/${APP_ROUTES_FEATURE.BROWSE.BOOKS}`,
  BOOK: (id: string) =>
    `/${APP_ROUTES_FEATURE.BROWSE.BASE}/${APP_ROUTES_FEATURE.BROWSE.BOOK}/${id}`,
} as const;

const ACCOUNT_FEATURE_PATHS = {
  ACCOUNT: () => `${APP_ROUTES_FEATURE.ACCOUNT.BASE}`,
  INFORMATION: () =>
    `/${APP_ROUTES_FEATURE.ACCOUNT.BASE}/${APP_ROUTES_FEATURE.ACCOUNT.INFORMATION}`,
  ORDERS: () =>
    `/${APP_ROUTES_FEATURE.ACCOUNT.BASE}/${APP_ROUTES_FEATURE.ACCOUNT.ORDERS}`,
  FAVOURITE_BOOKS_LIST: () =>
    `/${APP_ROUTES_FEATURE.ACCOUNT.BASE}/${APP_ROUTES_FEATURE.ACCOUNT.FAVOURITE_BOOKS_LIST}`,
} as const;

const CART_FEATURE_PATHS = {
  ORDER_PROCESS: () =>
    `/${APP_ROUTES_FEATURE.CART.BASE}/${APP_ROUTES_FEATURE.CART.ORDER_PROCESS}`,
  ORDER_SUMMARY: () =>
    `/${APP_ROUTES_FEATURE.CART.BASE}/${APP_ROUTES_FEATURE.CART.ORDER_SUMMARY}`,
  PAYMENT_STATUS: (id: string) =>
    `/${APP_ROUTES_FEATURE.CART.BASE}/${APP_ROUTES_FEATURE.CART.PAYMENT_STATUS}/${id}`,
} as const;

const SUPPORT_FEATURE_PATHS = {
  FAQ: () =>
    `/${APP_ROUTES_FEATURE.SUPPORT.BASE}/${APP_ROUTES_FEATURE.SUPPORT.FAQ}`,
} as const;

const APP_ROUTE_PATHS = {
  HOME: () => `/${APP_ROUTES_FEATURE.HOME.BASE}`,
  ...AUTH_FEATURE_PATHS,
  ...BROWSE_FEATURE_PATHS,
  ...ACCOUNT_FEATURE_PATHS,
  ...CART_FEATURE_PATHS,
  ...SUPPORT_FEATURE_PATHS,
} as const;

export const provideAppRoutePaths: Provider = {
  provide: APP_ROUTE_PATHS_TOKEN,
  useValue: APP_ROUTE_PATHS,
};
