import { Nav } from '@e-commerce/delivery-manager/core/feature/nav';
import { Outlet } from 'react-router-dom';

export function MainLayout() {
  return (
    <>
      <Nav />
      <div className="w-full h-full overflow-y-auto p-4 xl:pl-gap xl:p-0 xl:overflow-y-visible">
        <Outlet />
      </div>
    </>
  );
}

export default MainLayout;
