import { Link, NavLink } from 'react-router-dom';
import { useRef, useState } from 'react';
import { useAuthApi } from '@e-commerce/delivery-manager/auth/api';
import { Toast } from 'primereact/toast';
import { useCoreStore } from '@e-commerce/delivery-manager/core/data-access';

export function Nav() {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isLabelShowed, setIsLabelShowed] = useState(true);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const { logout } = useAuthApi();
  const toast = useRef<Toast | null>(null);
  const { isDark, setTheme } = useCoreStore();

  function expandCollapse() {
    setIsExpanded((isExpanded) => !isExpanded);

    if (timerRef.current) clearTimeout(timerRef.current);

    timerRef.current = setTimeout(
      () => {
        setIsLabelShowed(!isExpanded);
      },
      isExpanded ? 0 : 150,
    );
  }

  function onLogout() {
    logout();

    toast.current?.show({
      detail: 'You have been logged out',
      summary: 'Success',
      severity: 'success',
    });
  }

  return (
    <>
      <Toast ref={toast} />

      <div className="dock dock-md bg-base-300 sticky bottom-0 xl:hidden">
        <NavLink
          to="/"
          className={({ isActive }) => (isActive ? 'dock-active' : '')}
        >
          <span className="pi pi-home"></span>
          <span className="dock-label">Home</span>
        </NavLink>

        <NavLink
          to="/orders"
          className={({ isActive }) => (isActive ? 'dock-active' : '')}
        >
          <span className="pi pi-list"></span>
          <span className="dock-label">Orders</span>
        </NavLink>

        <button onClick={onLogout}>
          <span className="pi pi-sign-out"></span>
          <span className="dock-label">Log out</span>
        </button>
      </div>

      <div className="max-w-80">
        <div
          className={
            'transition-[width] duration-300 ease-in-out hidden justify-between gap-4 xl:h-content px-2 py-4 bg-base-300 xl:sticky z-[501] top-4 flex-col rounded-base xl:flex ' +
            (isExpanded ? 'w-80' : 'w-14')
          }
        >
          <nav className="h-content flex flex-col justify-between">
            <div className="flex flex-col">
              <div className="h-9 flex items-center justify-center">
                {isLabelShowed && (
                  <Link to="/" className="items-center justify-center">
                    <span className="font-bold text-primary">Story</span>
                    <span className="uppercase text-muted-color">Stash</span>
                  </Link>
                )}

                {!isLabelShowed && (
                  <Link to="/" className="px-3 h-10 flex items-center gap-4">
                    <i className="pi pi-home"></i>
                  </Link>
                )}
              </div>
              <div className="bg-primary w-full h-[1px] my-4"></div>
              <ul className="flex flex-col">
                <Link
                  to="/orders/list"
                  className="px-3 h-10 flex items-center gap-4"
                >
                  <i className="pi pi-list"></i>
                  {isLabelShowed && <span>Orders</span>}
                </Link>
              </ul>
            </div>

            <div className="flex flex-col gap-2">
              <button
                className="px-3 h-10 flex items-center gap-4"
                onClick={onLogout}
              >
                <i className="pi pi-sign-out"></i>
                {isLabelShowed && <span>Log out</span>}
              </button>
              <div className="bg-primary w-full h-[1px] my-4"></div>
              <button
                className="px-3 h-10 flex items-center gap-4"
                onClick={expandCollapse}
              >
                {isLabelShowed && (
                  <>
                    <i className="pi pi-arrow-left"></i>
                    <span>Collapse</span>
                  </>
                )}
                {!isLabelShowed && <i className="pi pi-arrow-right"></i>}
              </button>
            </div>
          </nav>
        </div>
      </div>
    </>
  );
}

export default Nav;
