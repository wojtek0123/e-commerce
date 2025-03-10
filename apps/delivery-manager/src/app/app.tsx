import { Route, Routes } from 'react-router-dom';
import { DeliverManagerAuthFeatureShell } from '@e-commerce/delivery-manager/auth/feature/shell';
import { PrimeReactProvider } from 'primereact/api';
import 'primeicons/primeicons.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Nav } from '@e-commerce/delivery-manager/core/feature/nav';
import { AuthGuard } from '@e-commerce/delivery-manager/shared/feature';
import { useAuthApi } from '@e-commerce/delivery-manager/auth/api';
import { useEffect } from 'react';

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
              path="/"
              element={
                <AuthGuard>
                  <Nav />
                </AuthGuard>
              }
            ></Route>
            <Route path="auth/*" element={<DeliverManagerAuthFeatureShell />} />
          </Routes>
        </div>
      </PrimeReactProvider>
    </QueryClientProvider>
  );
}

export default App;
