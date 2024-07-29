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
    authorsQueryParams: 'authors',
    minPriceQueryParams: 'min_price',
    maxPriceQueryParams: 'max_price',
  } as const,
  auth: {
    basePath: 'auth',
    loginPath: 'login',
    registerPath: 'register',
  } as const,
  order: {
    basePath: 'order',
  } as const,
  localStorage: {
    refreshToken: 'refresh_token',
    accessToken: 'access_token',
    userId: 'userId',
    theme: 'theme',
    cart: 'cart',
  } as const,
  queryParams: {
    categories: 'categories',
    tags: 'tags',
    authors: 'authors',
    minPrice: 'min_price',
    maxPrice: 'max_price',
    search: 'search',
  } as const,
} as const;
