import { Navigate, Route, Routes } from 'react-router-dom';
import { DeliverManagerAuthFeatureShell } from '@e-commerce/delivery-manager/auth/feature/shell';
import { PrimeReactProvider } from 'primereact/api';
import 'primeicons/primeicons.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthGuard } from '@e-commerce/delivery-manager/shared/feature';
import { useAuthApi } from '@e-commerce/delivery-manager/auth/api';
import { useEffect, useState } from 'react';
import { DeliveryManagerOrdersFeatureShell } from '@e-commerce/delivery-manager/orders/feature/shell';
import MainLayout from './main-layout';

const queryClient = new QueryClient();

export function App() {
  const { retrieveSession } = useAuthApi();

  useEffect(() => {
    retrieveSession();
  }, [retrieveSession]);

  return (
    <QueryClientProvider client={queryClient}>
      <PrimeReactProvider>
        <div className="flex flex-col-reverse w-full h-svh xl:flex-row xl:p-gap xl:min-h-svh xl:h-full">
          <Routes>
            <Route
              element={
                <AuthGuard>
                  <MainLayout />
                </AuthGuard>
              }
            >
              <Route
                path="orders/*"
                element={<DeliveryManagerOrdersFeatureShell />}
              />
              <Route path="*" element={<Navigate to="/orders" />} />
            </Route>
            <Route path="auth/*" element={<DeliverManagerAuthFeatureShell />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </PrimeReactProvider>
    </QueryClientProvider>
  );
}

export default App;
