import { Route, Routes } from 'react-router-dom';
import { Login } from '@e-commerce/delivery-manager/auth/feature/login';

export function DeliverManagerAuthFeatureShell() {
  return <Routes> <Route path="login" element={<Login />} /></Routes>;
}

export default DeliverManagerAuthFeatureShell;
