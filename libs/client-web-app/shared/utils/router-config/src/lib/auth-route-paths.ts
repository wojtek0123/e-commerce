import { appRouterConfig } from './app-router-config';

export const authRoutePaths = {
  login: `/${appRouterConfig.auth.basePath}/${appRouterConfig.auth.loginPath}`,
  register: `/${appRouterConfig.auth.basePath}/${appRouterConfig.auth.registerPath}`,
} as const;
