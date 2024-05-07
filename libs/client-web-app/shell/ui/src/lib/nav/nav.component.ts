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
import { AuthStore } from '@e-commerce/client-web-app/shared/data-access/auth';
import { AsyncPipe, NgClass } from '@angular/common';
import { MenuModule } from 'primeng/menu';
import { MegaMenuModule } from 'primeng/megamenu';
import { SidebarModule } from 'primeng/sidebar';
import { CategoryStore } from '@e-commerce/client-web-app/shared/data-access/category';
import { AccordionModule } from 'primeng/accordion';
import { BookTag } from '@e-commerce/client-web-app/shared/data-access/api-types';
import {
  appRouterConfig,
  authRoutePaths,
  browseRoutePaths,
} from '@e-commerce/client-web-app/shared/utils/router-config';

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
  ],
  templateUrl: './nav.component.html',
})
export class NavComponent {
  private authStore = inject(AuthStore);
  private categoryStore = inject(CategoryStore);

  navItems: {
    id: BookTag;
    name: string;
    url: string;
    queryParams?: Params;
    state?: { [key: string]: string | boolean };
  }[] = [
    {
      id: BookTag.NADCHODZACE,
      name: BookTag.NADCHODZACE.toLowerCase(),
      url: browseRoutePaths.default,
      queryParams: {
        [appRouterConfig.browse.tagsQueryParams]: BookTag.NADCHODZACE,
      },
      state: { [appRouterConfig.browse.clearHistoryState]: true },
    },
    {
      id: BookTag.BESTSELLER,
      name: BookTag.BESTSELLER.toLowerCase(),
      url: browseRoutePaths.default,
      queryParams: {
        [appRouterConfig.browse.tagsQueryParams]: BookTag.BESTSELLER,
      },
      state: { [appRouterConfig.browse.clearHistoryState]: true },
    },
    {
      id: BookTag.PROMOCJE,
      name: BookTag.PROMOCJE.toLowerCase(),
      url: browseRoutePaths.default,
      queryParams: {
        [appRouterConfig.browse.tagsQueryParams]: BookTag.PROMOCJE,
      },
      state: { [appRouterConfig.browse.clearHistoryState]: true },
    },
    {
      id: BookTag.NOWE,
      name: BookTag.NOWE.toLowerCase(),
      url: browseRoutePaths.default,
      queryParams: {
        [appRouterConfig.browse.tagsQueryParams]: BookTag.NOWE,
      },
      state: { [appRouterConfig.browse.clearHistoryState]: true },
    },
  ];

  sidebarVisible = signal(false);
  authTokens = this.authStore.tokens;
  categories = computed(() =>
    !this.categoryStore.categoriesCount()
      ? [
          {
            label: 'Błąd! Spróbuj ponownie',
            icon: 'pi pi-refresh',
            command: () => {
              this.categoryStore.getCategories();
              if (this.sidebarVisible()) {
                this.sidebarVisible.set(false);
              }
            },
          },
        ]
      : this.categoryStore.categories().map((category) => ({
          label: category.name,
          routerLink: browseRoutePaths.default,
          queryParams: {
            categories: category.name.toLowerCase().split(' ').join('_'),
          },
          state: { categoryIds: [category.id], clear: true },
          command: () => {
            if (this.sidebarVisible()) {
              this.sidebarVisible.set(false);
            }
          },
        }))
  );
  menuItems = computed(() =>
    !!this.authTokens()?.accessToken && !!this.authTokens()?.refreshToken
      ? [
          {
            label: 'Zamówienia',
            icon: 'pi pi-book',
            command: () => {
              if (this.sidebarVisible()) {
                this.sidebarVisible.set(false);
              }
            },
          },
          {
            label: 'Ustawienia',
            icon: 'pi pi-cog',
            command: () => {
              if (this.sidebarVisible()) {
                this.sidebarVisible.set(false);
              }
            },
          },
          {
            label: 'Log out',
            icon: 'pi pi-sign-out',
            command: () => {
              this.authStore.logout();
              if (this.sidebarVisible()) {
                this.sidebarVisible.set(false);
              }
            },
          },
        ]
      : [
          {
            label: 'Zaloguj się',
            icon: 'pi pi-sign-in',
            routerLink: authRoutePaths.login,
            command: () => {
              if (this.sidebarVisible()) {
                this.sidebarVisible.set(false);
              }
            },
          },
          {
            label: 'Zarejestruj się',
            icon: 'pi pi-user-plus',
            routerLink: authRoutePaths.register,
            command: () => {
              if (this.sidebarVisible()) {
                this.sidebarVisible.set(false);
              }
            },
          },
        ]
  );

  showSidebar = () => this.sidebarVisible.set(true);

  @HostBinding('class') class = 'z-1';
}
