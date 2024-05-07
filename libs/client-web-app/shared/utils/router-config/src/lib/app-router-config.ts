export const appRouterConfig = {
  defaultPath: '',
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
} as const;
