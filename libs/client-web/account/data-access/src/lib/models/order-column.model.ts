import { OrderDetails } from '@e-commerce/shared/api-models';

export interface OrderColumn {
  header: string;
  field: keyof OrderDetails;
}
