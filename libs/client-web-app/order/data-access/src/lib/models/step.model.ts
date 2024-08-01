import { appRouterConfig } from '@e-commerce/client-web-app/shared/utils/router-config';

export type Step =
  | 'cart'
  | typeof appRouterConfig.order.addressInformation
  | typeof appRouterConfig.order.shippingMethod
  | typeof appRouterConfig.order.paymentMethod
  | typeof appRouterConfig.order.paymentStatus;
