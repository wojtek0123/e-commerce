import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthApi } from '@e-commerce/delivery-manager/auth/api';

export function AuthGuard({ children }: { children: any }) {
  const { isAuthenticated } = useAuthApi();

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" />;
  }

  return children;
}

export default AuthGuard;
