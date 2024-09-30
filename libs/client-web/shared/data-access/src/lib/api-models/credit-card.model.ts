export interface CreditCardBase {
  id: string;
  number: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreditCard extends CreditCardBase {
  securityCode: string;
  expirationDate: string;
}
