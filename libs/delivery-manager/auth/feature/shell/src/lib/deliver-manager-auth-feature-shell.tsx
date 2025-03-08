import { Route, Routes } from 'react-router-dom';
import { Login } from '@e-commerce/delivery-manager/auth/feature/login';

export function DeliverManagerAuthFeatureShell() {
  return (
    <div className="flex flex-col-reverse w-full gap-4 xl:grid xl:h-content xl:grid-cols-2">
      <div className="flex flex-col items-center h-content justify-center w-full">
        <div className="max-w-[30rem] h-full flex flex-col items-center justify-center w-full">
          <Routes>
            <Route path="login" element={<Login />} />
          </Routes>
        </div>
      </div>
      <div className="hidden xl:flex rounded-base overflow-hidden w-full h-full xl:content-end xl:h-content">
        <img
          className="object-fill object-center w-full"
          src="/auth-books.webp"
          alt="book store"
        />
      </div>
    </div>
  );
}

export default DeliverManagerAuthFeatureShell;
