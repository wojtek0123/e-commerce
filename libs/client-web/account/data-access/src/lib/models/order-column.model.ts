import { OrderDetails } from '@e-commerce/client-web/shared/data-access/api-models';

export interface OrderColumn {
  header: string;
  field: keyof OrderDetails;
}
