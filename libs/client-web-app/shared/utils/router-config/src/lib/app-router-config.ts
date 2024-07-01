export const appRouterConfig = {
  emptyPath: '',
  browse: {
    basePath: 'browse',
    detailsPath: 'details',
    bookId: 'bookId',
    tagsQueryParams: 'tags',
    categoriesQueryParams: 'categories',
    searchQueryParams: 'search',
    clearHistoryState: 'clear',
    categoriesData: 'categories',
  },
  auth: {
    basePath: 'auth',
    loginPath: 'login',
    registerPath: 'register',
  },
  order: {
    basePath: 'order',
  },
  localStorage: {
    refreshToken: 'refresh_token',
    accessToken: 'access_token',
    user: 'user',
    theme: 'theme',
    cart: 'cart',
  },
} as const;
