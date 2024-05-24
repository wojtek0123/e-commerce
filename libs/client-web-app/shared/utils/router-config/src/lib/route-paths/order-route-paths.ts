import { appRouterConfig } from '../app-router-config';

const {
  basePath,
  cartItemsPath,
  deliveryAddressPath,
  paymentPath,
  summaryPath,
} = appRouterConfig.order;

export const orderRoutePaths = {
  default: `/${basePath}`,
  cartItems: `/${basePath}/${cartItemsPath}`,
  deliveryAddress: `/${basePath}/${deliveryAddressPath}`,
  payment: `/${basePath}/${paymentPath}`,
  summary: `/${basePath}/${summaryPath}`,
} as const;
