import { Routes, Route, Navigate } from 'react-router-dom';
import { OrderList } from '@e-commerce/delivery-manager/orders/feature/order-list';

export function DeliveryManagerOrdersFeatureShell() {
  return (
    <Routes>
      <Route path="list" element={<OrderList />} />
      <Route path="*" element={<Navigate to="/orders/list" />} />
    </Routes>
  );
}

export default DeliveryManagerOrdersFeatureShell;
