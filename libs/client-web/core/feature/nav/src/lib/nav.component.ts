import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { NgTemplateOutlet } from '@angular/common';
import {
  afterNextRender,
  Component,
  computed,
  inject,
  Injector,
  OnDestroy,
  runInInjectionContext,
  Signal,
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
  APP_ROUTES_FEATURE,
} from '@e-commerce/client-web/shared/app-config';
import {
  DrawerLeftDirective,
  NavButtonDirective,
} from '@e-commerce/client-web/shared/utils';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { MenuModule } from 'primeng/menu';
import { ToolbarModule } from 'primeng/toolbar';
import { combineLatest, debounce, filter, map, of, timer } from 'rxjs';
import { ThemeService } from '@e-commerce/client-web/core/data-access';
import { CategoryStore } from '@e-commerce/client-web/shared/data-access/stores';
import { DrawerModule } from 'primeng/drawer';
import { GetNamePipe } from './pipes/get-name.pipe';

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
    GetNamePipe,
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
      transition('in <=> out', [animate('200ms ease-in-out')]),
    ]),
  ],
})
export class NavComponent implements OnDestroy {
  #themeService = inject(ThemeService);
  #categoriesStore = inject(CategoryStore);
  #authService = inject(AuthService);
  #appLocalStorageKeys = inject(APP_LOCAL_STORAGE_KEYS_TOKEN);
  #appRoutePaths = inject(APP_ROUTE_PATHS_TOKEN);
  #injector = inject(Injector);

  #appRouteFeatures = APP_ROUTES_FEATURE;

  isAuthenticated = this.#authService.isAuthenticated;
  categories = this.#categoriesStore.categories;
  isDark = this.#themeService.isDark;

  urls = signal({
    home: this.#appRoutePaths.HOME(),
    books: this.#appRoutePaths.BOOKS(),
    account: this.#appRoutePaths.ACCOUNT(),
    login: this.#appRoutePaths.LOGIN(),
    register: this.#appRoutePaths.REGISTER(),
    favouriteBooksList: this.#appRoutePaths.FAVOURITE_BOOKS_LIST(),
  }).asReadonly();
  mobileBreakpoint = signal(1280).asReadonly();
  isMobileDrawerOpened = signal(false);
  isExpanded = signal(false);
  menuItems = signal([
    {
      label: 'Orders',
      icon: 'pi pi-book',
      routerLink: this.#appRoutePaths.ORDERS(),
    },
    {
      label: 'Information',
      icon: 'pi pi-cog',
      routerLink: this.#appRoutePaths.INFORMATION(),
    },
    {
      label: 'Favourite books',
      icon: 'pi pi-heart',
      routerLink: this.#appRoutePaths.FAVOURITE_BOOKS_LIST(),
    },
  ]);
  isLabelShowed: Signal<boolean> | undefined;
  isAccountRouteActive = toSignal(
    inject(Router).events.pipe(
      filter((events) => events instanceof NavigationEnd),
      map((event) => event.url.includes(this.#appRouteFeatures.ACCOUNT.BASE)),
    ),
  );
  resizeObserver = signal<ResizeObserver | undefined>(undefined);

  constructor() {
    afterNextRender(() => {
      const isExpanded = localStorage.getItem(
        this.#appLocalStorageKeys.IS_EXPANDED,
      );

      if (isExpanded) {
        this.isExpanded.set(JSON.parse(isExpanded));
      }

      this.resizeObserver.set(
        new ResizeObserver(() => {
          if (window.innerWidth > this.mobileBreakpoint()) {
            this.isMobileDrawerOpened.set(false);
          }
        }),
      );

      this.resizeObserver()?.observe(document.body);

      runInInjectionContext(this.#injector, () => {
        this.isLabelShowed = toSignal(
          combineLatest([
            toObservable(this.isExpanded).pipe(
              debounce((isExpanded) => (isExpanded ? timer(150) : of({}))),
            ),
            toObservable(this.isMobileDrawerOpened),
          ]).pipe(
            map(
              ([isExpanded, isMobileDrawerOpened]) =>
                (isMobileDrawerOpened &&
                  window.innerWidth < this.mobileBreakpoint()) ||
                isExpanded,
            ),
          ),
          { initialValue: this.isExpanded() },
        );
      });
    });
  }

  toggleDarkMode() {
    this.#themeService.toggleDarkMode();
  }

  toggleMobileMenuDrawer() {
    if (this.mobileBreakpoint() <= window.innerWidth) return;

    this.isMobileDrawerOpened.update((isOpen) => !isOpen);
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

  ngOnDestroy(): void {
    this.resizeObserver()?.disconnect();
  }
}
