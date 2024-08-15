import { Component, computed, inject, signal } from '@angular/core';
import { Params, RouterLink } from '@angular/router';
import { DividerModule } from 'primeng/divider';
import { ButtonModule } from 'primeng/button';
import { AsyncPipe, NgClass } from '@angular/common';
import { MenuModule } from 'primeng/menu';
import { MegaMenuModule } from 'primeng/megamenu';
import { SidebarModule } from 'primeng/sidebar';
import { AccordionModule } from 'primeng/accordion';
import {
  BookTag,
  ShoppingSession,
} from '@e-commerce/client-web/shared/data-access';
import { TooltipModule } from 'primeng/tooltip';
import { InputSwitchChangeEvent, InputSwitchModule } from 'primeng/inputswitch';
import { ThemeService, Theme } from '../../services/theme.service';
import { FormsModule } from '@angular/forms';
import { BadgeModule } from 'primeng/badge';

@Component({
  selector: 'app-nav',
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
    InputSwitchModule,
    FormsModule,
    BadgeModule,
  ],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.scss',
})
export class NavComponent {
  // private authService = inject(AuthService);
  // private cartService = inject(CartService);
  private themeSwitcherService = inject(ThemeService);

  userCartItemsTotal = signal(0);

  shoppingSession = signal<ShoppingSession | null>(null);
  loading = signal(false);
  error = signal<string | null>(null);

  cartSidebarVisible = signal(false);
  // browseRoutePaths = browseRoutePaths;

  // cartItemsCount = this.cartService.count;

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
      url: '/browse',
      queryParams: {
        tags: BookTag.INCOMING.toLowerCase(),
      },
    },
    {
      id: BookTag.BESTSELLER,
      name: BookTag.BESTSELLER.toLowerCase(),
      url: '/browse',
      queryParams: {
        tags: BookTag.BESTSELLER.toLowerCase(),
      },
    },
    {
      id: BookTag.DISCOUNT,
      name: BookTag.DISCOUNT.toLowerCase(),
      url: '/browse',
      queryParams: {
        tags: BookTag.DISCOUNT.toLowerCase(),
      },
    },
    {
      id: BookTag.NEW,
      name: BookTag.NEW.toLowerCase(),
      url: '/browse',
      queryParams: {
        tags: BookTag.NEW.toLowerCase(),
      },
    },
  ];

  sidebarVisible = signal(false);
  isAuthenticated = signal(false);
  menuItems = computed(() =>
    this.isAuthenticated()
      ? [
          {
            label: 'Orders',
            icon: 'pi pi-book',
            routerLink: '/account/orders',
            command: () => {
              if (this.sidebarVisible()) {
                this.sidebarVisible.set(false);
              }
            },
          },
          {
            label: 'Settings',
            icon: 'pi pi-cog',
            routerLink: '/account/settings',
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
              // this.authService.logout();
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
            routerLink: '/login',
            command: () => {
              if (this.sidebarVisible()) {
                this.sidebarVisible.set(false);
              }
            },
          },
          {
            label: 'Sign up',
            icon: 'pi pi-user-plus',
            routerLink: '/register',
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
    routerLink: '/browse',
    queryParams: {
      categories: null,
      tags: null,
      search: null,
    },
  };

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
