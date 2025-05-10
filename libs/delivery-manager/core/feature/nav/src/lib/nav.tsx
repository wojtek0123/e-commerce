import { Link, NavLink } from 'react-router-dom';
import { useContext, useEffect, useRef, useState } from 'react';
import { useAuthApi } from '@e-commerce/delivery-manager/auth/api';
import { useCoreStore } from '@e-commerce/delivery-manager/core/data-access';
import { useToastStore } from '@e-commerce/delivery-manager/shared/data-access';
import { Divider } from 'primereact/divider';
import { Toolbar } from 'primereact/toolbar';
import { PrimeReactContext } from 'primereact/api';

export function Nav() {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isLabelShowed, setIsLabelShowed] = useState(true);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const { logout } = useAuthApi();
  const toast = useToastStore();
  const [isDark, setIsDark] = useState(true);
  const { changeTheme } = useContext(PrimeReactContext)


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

    toast.show({
      detail: 'You have been logged out',
      severity: 'success',
      summary: 'Success',
    });
  }

  function toggleTheme() {
    const currentThemeLink = (document.getElementById('theme-link') as HTMLLinkElement).href
    const currentTheme = new URL(currentThemeLink).pathname
    const newTheme = currentTheme.replace(currentTheme.includes('dark') ? 'dark' : 'light', currentTheme.includes('dark') ? 'light' : 'dark')


    setIsDark(newTheme.includes('dark'))



    changeTheme?.(currentTheme, newTheme, 'theme-link');
  }

  return (
    <>
      <Toolbar
        className="xl:hidden"
        center={
          <div className="flex gap-4">
            <NavLink
              to="/orders"
              className={({ isActive }) =>
                `flex flex-col items-center ${isActive ? '' : 'text-[var(--surface-400)]'}`
              }
            >
              <span className="pi pi-box"></span>
              <span className="dock-label">Orders</span>
            </NavLink>

            <NavLink
              to="/supplies"
              className={({ isActive }) =>
                `flex flex-col items-center ${isActive ? '' : 'text-[var(--surface-400)]'}`
              }
            >
              <span className="pi pi-truck"></span>
              <span className="dock-label">Supplies</span>
            </NavLink>
          </div>
        }
        end={
          <button onClick={onLogout} className="flex flex-col items-center">
            <span className="pi pi-sign-out"></span>
            <span className="dock-label">Log out</span>
          </button>
        }
      />

      <div className="max-w-80">
        <div
          className={
            'transition-[width] bg-content-background duration-300 ease-in-out hidden justify-between gap-4 xl:h-content px-2 py-4 bg-base-300 xl:sticky z-[501] top-4 flex-col rounded-base xl:flex ' +
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
              <Divider />
              <ul className="flex flex-col">
                <NavLink
                  to="/orders/list"
                  className={({ isActive }) =>
                    isActive
                      ? 'bg-surface-200 px-3 h-10 flex items-center gap-4 rounded-base'
                      : 'px-3 h-10 flex items-center gap-4 rounded-base'
                  }
                >
                  <i className="pi pi-box"></i>
                  {isLabelShowed && <span>Orders</span>}
                </NavLink>

                <NavLink
                  to="/supplies/list"
                  className={({ isActive }) =>
                    isActive
                      ? 'bg-surface-200 px-3 h-10 flex items-center gap-4 rounded-base'
                      : 'px-3 h-10 flex items-center gap-4 rounded-base'
                  }
                >
                  <i className="pi pi-truck"></i>
                  {isLabelShowed && <span>Supplies</span>}
                </NavLink>
              </ul>
            </div>

            <div className="flex flex-col gap-2">
              <button
                onClick={toggleTheme}
                className="px-3 h-10 flex items-center gap-4"
              >
                {isDark ? <i className="pi pi-moon"></i> : <i className="pi pi-sun"></i>}
                {isLabelShowed && <span>{isDark ? 'Dark' : 'Light'}</span>}
              </button>
              <button
                className="px-3 h-10 flex items-center gap-4"
                onClick={onLogout}
              >
                <i className="pi pi-sign-out"></i>
                {isLabelShowed && <span>Log out</span>}
              </button>
              <Divider />
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
