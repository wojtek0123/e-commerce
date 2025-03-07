import { Route, Routes } from 'react-router-dom';
import { DeliverManagerAuthFeatureShell } from '@e-commerce/delivery-manager/auth/feature/shell';
import { PrimeReactProvider } from 'primereact/api';
// import 'primereact/resources/themes/soho-dark/theme.css';

import 'primereact/resources/themes/lara-light-indigo/theme.css'; // theme
import 'primeicons/primeicons.css';
import 'primereact/resources/primereact.css'; // core css

export function App() {
  return (
    <PrimeReactProvider>
      <Routes>
        <Route
          path="/"
          element={<div>This is the generated root route. </div>}
        />
        <Route path="auth/*" element={<DeliverManagerAuthFeatureShell />} />
      </Routes>
    </PrimeReactProvider>
  );
}

export default App;
