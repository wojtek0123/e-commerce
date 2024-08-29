export interface CreditCardBase {
  id: number;
  number: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreditCard extends CreditCardBase {
  securityCode: string;
  expirationDate: string;
}
