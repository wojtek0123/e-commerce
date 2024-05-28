import { appRouterConfig } from './app-router-config';

const { basePath, bookId } = appRouterConfig.browse;

export const browseRoutePaths = {
  default: `/${basePath}`,
  details: `/${basePath}/:${bookId}`,
} as const;

export const getBrowserRouteDetails = (bookdId: number) =>
  `/${basePath}/${bookdId}`;
