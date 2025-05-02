import { Navigate, Route, Routes } from 'react-router-dom';
import { DeliverManagerAuthFeatureShell } from '@e-commerce/delivery-manager/auth/feature/shell';
import 'primeicons/primeicons.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthGuard } from '@e-commerce/delivery-manager/shared/feature';
import { useAuthApi } from '@e-commerce/delivery-manager/auth/api';
import { useEffect, useRef } from 'react';
import { DeliveryManagerOrdersFeatureShell } from '@e-commerce/delivery-manager/orders/feature/shell';
import MainLayout from './main-layout';
import { useToastStore } from '@e-commerce/delivery-manager/shared/data-access';
import { SuppliesShell } from '@e-commerce/delivery-manager/supplies/feature/shell';
import { PrimeReactProvider } from 'primereact/api';
import { Toast } from 'primereact/toast';

const queryClient = new QueryClient();

export function App() {
  const toastRef = useRef<Toast | null>(null);
  const toast = useToastStore();
  const { retrieveSession } = useAuthApi();

  useEffect(() => {
    retrieveSession();
  }, [retrieveSession]);

  useEffect(() => {
    if (!toastRef.current || !toast.toastMessage) return;

    toastRef.current.show(toast.toastMessage);
  }, [toast.toastMessage]);

  return (
    <QueryClientProvider client={queryClient}>
      <PrimeReactProvider>
        <Toast ref={toastRef} />
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
              <Route path="supplies/*" element={<SuppliesShell />} />
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
