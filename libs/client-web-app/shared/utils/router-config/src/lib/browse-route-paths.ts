import { appRouterConfig } from './app-router-config';

export const browseRoutePaths = {
  default: `/${appRouterConfig.browse.basePath}`,
  details: `/${appRouterConfig.browse.basePath}/:${appRouterConfig.browse.bookId}`,
} as const;

export const getBrowserRouteDetails = (bookdId: number) =>
  `/${appRouterConfig.browse.basePath}/${bookdId}`;
