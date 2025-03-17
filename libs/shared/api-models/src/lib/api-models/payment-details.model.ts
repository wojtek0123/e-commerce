import { PaymentMethod } from './payment-method.model';

export interface PaymentDetails {
  id: string;
  amount: number;
  status: PaymentStatus;
  method: PaymentMethod;
}

export type PaymentStatus = 'PROCESSING' | 'SUCCEEDED' | 'FAILED';
