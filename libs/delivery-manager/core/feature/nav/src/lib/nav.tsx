import { Link } from 'react-router-dom';
import { Divider } from 'primereact/divider';
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
      <div className="max-w-80">
        <div
          className={
            'transition-[width] duration-300 ease-in-out hidden justify-between gap-4 xl:h-content px-2 py-4 bg-content-background xl:sticky z-[501] top-4 flex-col rounded-base xl:flex ' +
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
                  <Link
                    v-if="!store.shouldLabelBeShowed"
                    to="/"
                    className="text-muted-color px-3 h-10 flex items-center gap-4 !rounded-base overflow-hidden hover:bg-surface-100 hover:dark:bg-surface-700"
                  >
                    <i className="pi pi-home"></i>
                  </Link>
                )}
              </div>
              <Divider />
              <ul className="flex flex-col">
                <Link
                  to="/books"
                  className="text-muted-color px-3 h-10 flex items-center gap-4 !rounded-base overflow-hidden hover:bg-surface-100 hover:dark:bg-surface-700 cursorpointer"
                >
                  <i className="pi pi-book"></i>
                  {isLabelShowed && <span>Books</span>}
                </Link>

                <Link
                  to="/categories"
                  className="text-muted-color px-3 h-10 flex items-center gap-4 !rounded-base overflow-hidden hover:bg-surface-100 hover:dark:bg-surface-700 cursorpointer"
                >
                  <i className="pi pi-objects-column"></i>
                  {isLabelShowed && <span>Categories</span>}
                </Link>
              </ul>
            </div>

            <div className="flex flex-col gap-2">
              <button
                className="text-muted-color px-3 h-10 flex items-center gap-4 !rounded-base overflow-hidden hover:bg-surface-100 hover:dark:bg-surface-700"
                onClick={onLogout}
              >
                <i className="pi pi-sign-out"></i>
                {isLabelShowed && <span v-if="store.isExpanded">Log out</span>}
              </button>
              <Divider />
              <button
                className="text-muted-color px-3 h-10 flex items-center gap-4 !rounded-base overflow-hidden hover:bg-surface-100 hover:dark:bg-surface-700"
                onClick={setTheme}
              >
                {isDark ? (
                  <i v-if="store.isDark" className="pi pi-moon"></i>
                ) : (
                  <i v-if="!store.isDark" className="pi pi-sun"></i>
                )}
                {isLabelShowed && isDark && <span>Dark</span>}
                {isLabelShowed && !isDark && <span>Light</span>}
              </button>
              <button
                className="text-muted-color px-3 h-10 flex items-center gap-4 !rounded-base overflow-hidden hover:bg-surface-100 hover:dark:bg-surface-700"
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
