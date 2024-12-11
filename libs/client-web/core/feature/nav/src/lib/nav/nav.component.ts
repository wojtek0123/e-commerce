import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { isPlatformBrowser, NgTemplateOutlet } from '@angular/common';
import {
  afterNextRender,
  Component,
  inject,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
  signal,
} from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import {
  NavigationEnd,
  Router,
  RouterLink,
  RouterLinkActive,
} from '@angular/router';
import { AuthService } from '@e-commerce/client-web/auth/api';
import { CartSidebarComponent } from '@e-commerce/client-web/cart/feature/cart-sidebar';
import {
  APP_LOCAL_STORAGE_KEYS_TOKEN,
  APP_ROUTE_PATHS_TOKEN,
} from '@e-commerce/client-web/shared/app-config';
import { Category } from '@e-commerce/client-web/shared/data-access/api-models';
import {
  DrawerLeftDirective,
  NavButtonDirective,
} from '@e-commerce/client-web/shared/utils';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { MenuModule } from 'primeng/menu';
import { ToolbarModule } from 'primeng/toolbar';
import { debounce, filter, map, of, timer } from 'rxjs';
import { ThemeService } from '@e-commerce/client-web/core/data-access';
import { CategoryStore } from '@e-commerce/client-web/shared/data-access/stores';
import { DrawerModule } from 'primeng/drawer';

@Component({
  selector: 'lib-nav',
  standalone: true,
  imports: [
    DividerModule,
    ButtonModule,
    MenuModule,
    RouterLink,
    FormsModule,
    RouterLinkActive,
    DrawerModule,
    NgTemplateOutlet,
    ToolbarModule,
    NavButtonDirective,
    CartSidebarComponent,
    DrawerLeftDirective,
  ],
  providers: [ThemeService],
  templateUrl: './nav.component.html',
  animations: [
    trigger('slideInOut', [
      state(
        'in',
        style({
          width: '20rem',
        }),
      ),
      state(
        'out',
        style({
          width: '3.5rem',
        }),
      ),
      transition('in <=> out', [animate('300ms ease-in-out')]),
    ]),
  ],
})
export class NavComponent implements OnInit, OnDestroy {
  #themeService = inject(ThemeService);
  #categoriesStore = inject(CategoryStore);
  #authService = inject(AuthService);
  #appLocalStorageKeys = inject(APP_LOCAL_STORAGE_KEYS_TOKEN);
  #platform = inject(PLATFORM_ID);

  appRoutePaths = inject(APP_ROUTE_PATHS_TOKEN);

  isAuthenticated = this.#authService.isAuthenticated;
  categories = this.#categoriesStore.categories;
  isOpen = signal(false);
  isExpanded = signal(true);
  isLabelShowed = toSignal(
    toObservable(this.isExpanded).pipe(
      debounce((isExpanded) => (isExpanded ? timer(150) : of({}))),
    ),
    { initialValue: false },
  );
  isDark = this.#themeService.isDark;

  resizeObserver?: ResizeObserver;
  shouldRestoreExpanded = signal(false);

  constructor() {
    afterNextRender(() => {});
  }

  ngOnInit() {
    // TODO: Create shared config to all routes and local storage keys

    if (isPlatformBrowser(this.#platform)) {
      const isExpanded = localStorage.getItem(
        this.#appLocalStorageKeys.IS_EXPANDED,
      );

      if (isExpanded) {
        this.isExpanded.set(JSON.parse(isExpanded));
      }

      const mediaQueryList = matchMedia('(min-width: 1280px)');

      this.resizeObserver = new ResizeObserver(() => {
        if (mediaQueryList.matches && this.shouldRestoreExpanded()) {
          const isExpanded = JSON.parse(
            localStorage.getItem(this.#appLocalStorageKeys.IS_EXPANDED) ||
              'false',
          );

          this.isExpanded.set(isExpanded);
          // this.isLabelShowed.set(isExpanded);
          this.shouldRestoreExpanded.set(false);
        } else if (!mediaQueryList.matches) {
          // this.isLabelShowed.set(true);
          this.isExpanded.set(true);
          this.shouldRestoreExpanded.set(true);
        }
      });

      this.resizeObserver.observe(document.body);
    }
  }

  ngOnDestroy(): void {
    this.resizeObserver?.unobserve(document.body);
  }

  stringifyCategory(category: Category) {
    return JSON.stringify(category);
  }

  isAccountRouteActive = toSignal(
    inject(Router).events.pipe(
      filter((events) => events instanceof NavigationEnd),
      map((event) => event.url.includes('account')),
    ),
  );

  // TODO: stworzyć injectionToken dla, aby było jedno źródło danych (app.routes i tutaj)
  menuItems = signal([
    {
      label: 'Orders',
      icon: 'pi pi-book',
      routerLink: this.appRoutePaths.ORDERS(),
      routerLinkActive: 'bg-surface-100 dark:bg-surface-700 rounded-base',
    },
    {
      label: 'Information',
      icon: 'pi pi-cog',
      routerLink: this.appRoutePaths.INFORMATION(),
      routerLinkActive: 'bg-surface-100 dark:bg-surface-700 rounded-base',
    },
  ]);

  toggleDarkMode() {
    this.#themeService.toggleDarkMode();
  }

  toggleNavigation() {
    this.isOpen.update((isOpen) => !isOpen);
  }

  expandCollapseNavigation() {
    this.isExpanded.update((isExpanded) => !isExpanded);
    localStorage.setItem(
      this.#appLocalStorageKeys.IS_EXPANDED,
      JSON.stringify(this.isExpanded()),
    );
  }

  logout() {
    this.#authService.logout();
  }
}
