import { appRouterConfig } from '../app-router-config';

const { basePath } = appRouterConfig.order;

export const orderRoutePaths = {
  default: `/${basePath}`,
} as const;
