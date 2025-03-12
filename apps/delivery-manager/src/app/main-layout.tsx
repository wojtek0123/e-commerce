import { Nav } from '@e-commerce/delivery-manager/core/feature/nav';
import { Outlet } from 'react-router-dom';

export function MainLayout() {
  return (
    <div className="flex w-full gap-base">
      <Nav />
      <Outlet />
    </div>
  );
}

export default MainLayout;
