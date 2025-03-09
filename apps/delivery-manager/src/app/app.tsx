import { Route, Routes } from 'react-router-dom';
import { DeliverManagerAuthFeatureShell } from '@e-commerce/delivery-manager/auth/feature/shell';
import { PrimeReactProvider } from 'primereact/api';
import 'primeicons/primeicons.css';
import {
  QueryClient,
  QueryClientProvider,
  useQueryClient,
} from '@tanstack/react-query';

const queryClient = new QueryClient();

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <PrimeReactProvider>
        <div className="flex flex-col-reverse w-full h-svh xl:flex-row xl:p-gap xl:min-h-svh xl:h-full">
          <Routes>
            <Route
              path="/"
              element={<div>This is the generated root route. </div>}
            />
            <Route path="auth/*" element={<DeliverManagerAuthFeatureShell />} />
          </Routes>
        </div>
      </PrimeReactProvider>
    </QueryClientProvider>
  );
}

export default App;
