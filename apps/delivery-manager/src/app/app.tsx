import { Route, Routes } from 'react-router-dom';
import { DeliverManagerAuthFeatureShell } from '@e-commerce/delivery-manager/auth/feature/shell';
import { PrimeReactProvider } from 'primereact/api';
import 'primeicons/primeicons.css';

export function App() {
  return (
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
  );
}

export default App;
