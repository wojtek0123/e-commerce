import {
  Component,
  HostBinding,
  computed,
  inject,
  signal,
} from '@angular/core';
import { Params, RouterLink } from '@angular/router';
import { DividerModule } from 'primeng/divider';
import { ButtonModule } from 'primeng/button';
import { AuthService } from '@e-commerce/client-web-app/shared/data-access/auth';
import { AsyncPipe, NgClass } from '@angular/common';
import { MenuModule } from 'primeng/menu';
import { MegaMenuModule } from 'primeng/megamenu';
import { SidebarModule } from 'primeng/sidebar';
import { AccordionModule } from 'primeng/accordion';
import {
  BookTag,
  ShoppingSession,
} from '@e-commerce/client-web-app/shared/data-access/api-types';
import {
  appRouterConfig,
  authRoutePaths,
  browseRoutePaths,
} from '@e-commerce/client-web-app/shared/utils/router-config';
import { TooltipModule } from 'primeng/tooltip';
import { CartSidebarComponent } from '../components/cart-sidebar/cart-sidebar.component';
import { InputSwitchChangeEvent, InputSwitchModule } from 'primeng/inputswitch';
import {
  ThemeSwitherService,
  Theme,
} from '@e-commerce/client-web-app/shell/data-access/theme-switcher';
import { FormsModule } from '@angular/forms';
import { BadgeModule } from 'primeng/badge';
import { CartService } from '@e-commerce/client-web-app/shared/data-access/cart';
import { CategoriesComponent } from '../components/categories/categories.component';

@Component({
  selector: 'lib-e-commerce-nav',
  standalone: true,
  imports: [
    RouterLink,
    DividerModule,
    ButtonModule,
    AsyncPipe,
    MenuModule,
    MegaMenuModule,
    RouterLink,
    NgClass,
    SidebarModule,
    AccordionModule,
    TooltipModule,
    CartSidebarComponent,
    InputSwitchModule,
    FormsModule,
    BadgeModule,
    CategoriesComponent,
  ],
  templateUrl: './nav.component.html',
  styles: [
    `
      :host ::ng-deep {
        .p-button-icon {
          font-size: 1.5rem;
        }

        .p-button {
          min-width: fit-content !important;
        }
      }
    `,
  ],
})
export class NavComponent {
  private authService = inject(AuthService);
  private cartService = inject(CartService);
  private themeSwitcherService = inject(ThemeSwitherService);

  userCartItemsTotal = signal(0);

  shoppingSession = signal<ShoppingSession | null>(null);
  loading = signal(false);
  error = signal<string | null>(null);

  cartSidebarVisible = signal(false);
  browseRoutePaths = browseRoutePaths;

  cartItemsCount = this.cartService.count;

  navItems: {
    id: BookTag;
    name: string;
    url: string;
    queryParams?: Params;
    state?: { [key: string]: string | boolean };
  }[] = [
    {
      id: BookTag.INCOMING,
      name: BookTag.INCOMING.toLowerCase(),
      url: browseRoutePaths.default,
      queryParams: {
        [appRouterConfig.browse.tagsQueryParams]:
          BookTag.INCOMING.toLowerCase(),
      },
    },
    {
      id: BookTag.BESTSELLER,
      name: BookTag.BESTSELLER.toLowerCase(),
      url: browseRoutePaths.default,
      queryParams: {
        [appRouterConfig.browse.tagsQueryParams]:
          BookTag.BESTSELLER.toLowerCase(),
      },
    },
    {
      id: BookTag.DISCOUNT,
      name: BookTag.DISCOUNT.toLowerCase(),
      url: browseRoutePaths.default,
      queryParams: {
        [appRouterConfig.browse.tagsQueryParams]:
          BookTag.DISCOUNT.toLowerCase(),
      },
    },
    {
      id: BookTag.NEW,
      name: BookTag.NEW.toLowerCase(),
      url: browseRoutePaths.default,
      queryParams: {
        [appRouterConfig.browse.tagsQueryParams]: BookTag.NEW.toLowerCase(),
      },
    },
  ];

  sidebarVisible = signal(false);
  isAuthenticated = this.authService.isAuthenticated;
  menuItems = computed(() =>
    this.isAuthenticated()
      ? [
          {
            label: 'Orders',
            icon: 'pi pi-book',
            routerLink: '/user/orders',
            command: () => {
              if (this.sidebarVisible()) {
                this.sidebarVisible.set(false);
              }
            },
          },
          {
            label: 'Settings',
            icon: 'pi pi-cog',
            routerLink: '/user/settings',
            command: () => {
              if (this.sidebarVisible()) {
                this.sidebarVisible.set(false);
              }
            },
          },
          {
            label: 'Sign out',
            icon: 'pi pi-sign-out',
            command: () => {
              this.authService.logout();
              if (this.sidebarVisible()) {
                this.sidebarVisible.set(false);
              }
            },
          },
        ]
      : [
          {
            label: 'Sign in',
            icon: 'pi pi-sign-in',
            routerLink: authRoutePaths.login,
            command: () => {
              if (this.sidebarVisible()) {
                this.sidebarVisible.set(false);
              }
            },
          },
          {
            label: 'Sign up',
            icon: 'pi pi-user-plus',
            routerLink: authRoutePaths.register,
            command: () => {
              if (this.sidebarVisible()) {
                this.sidebarVisible.set(false);
              }
            },
          },
        ],
  );

  showSidebar = () => this.sidebarVisible.set(true);

  search = {
    routerLink: browseRoutePaths.default,
    queryParams: {
      [appRouterConfig.browse.categoriesQueryParams]: null,
      [appRouterConfig.browse.tagsQueryParams]: null,
      [appRouterConfig.browse.searchQueryParams]: null,
    },
    state: {
      [appRouterConfig.browse.clearHistoryState]: true,
    },
  };

  @HostBinding('class') class = 'z-1';

  openCart() {
    this.cartSidebarVisible.set(true);
  }

  theme = computed(() =>
    this.themeSwitcherService.theme() === 'dark' ? true : false,
  )();

  onChangeTheme(event: InputSwitchChangeEvent) {
    const theme: Theme = event.checked ? 'dark' : 'light';

    this.themeSwitcherService.switchTheme(theme);
  }
}
