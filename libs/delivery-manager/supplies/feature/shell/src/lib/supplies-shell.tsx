import { Routes, Route, Navigate } from 'react-router-dom';
import { SupplyList } from '@e-commerce/delivery-manager/supplies/feature/supply-list';

export function SuppliesShell() {
  return (
    <Routes>
      <Route path="list" element={<SupplyList />} />
      <Route path="*" element={<Navigate to="/supplies/list" />} />
    </Routes>
  );
}

export default SuppliesShell;
