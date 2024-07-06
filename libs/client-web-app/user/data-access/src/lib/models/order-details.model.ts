export interface OrderDetails {
  id: number;
  total: number;
  createdAt: string;
  updatedAt: string;
  userAddressId: number;
  paymentDetailsId: number;
  shippingMethodId: number;
}
