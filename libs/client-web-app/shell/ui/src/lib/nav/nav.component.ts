import { Component, effect, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DividerModule } from 'primeng/divider';
import { ButtonModule } from 'primeng/button';
import { AuthStore } from '@e-commerce/client-web-app/shared/data-access/auth';
import { AsyncPipe, NgClass } from '@angular/common';
import { MenuItem } from 'primeng/api';
import { MenuModule } from 'primeng/menu';
import { CategoryStore } from '@e-commerce/client-web-app/shared/data-access/category';
import { MegaMenuModule } from 'primeng/megamenu';

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
  ],
  templateUrl: './nav.component.html',
})
export class NavComponent {
  private authStore = inject(AuthStore);
  private categoryStore = inject(CategoryStore);

  authTokens = this.authStore.tokens;

  categories: MenuItem[] = [
    {
      label: 'Pokaż wszystkie',
      routerLink: '/ksiazki',
      queryParams: { category: 'wszystkie' },
    },
  ];

  menuItems: MenuItem[] = [
    {
      label: 'Zaloguj się',
      icon: 'pi pi-sign-in',
      routerLink: '/auth/login',
    },
    {
      label: 'Zarejestruj się',
      icon: 'pi pi-user-plus',
      routerLink: '/auth/register',
    },
  ];

  constructor() {
    effect(() => {
      this.menuItems =
        !!this.authTokens()?.accessToken && !!this.authTokens()?.refreshToken
          ? [
              {
                label: 'Zamówienia',
                icon: 'pi pi-book',
              },
              {
                label: 'Ustawienia',
                icon: 'pi pi-cog',
              },
              {
                label: 'Log out',
                icon: 'pi pi-sign-out',
                command: () => this.authStore.logout(),
              },
            ]
          : [
              {
                label: 'Zaloguj się',
                icon: 'pi pi-sign-in',
                routerLink: '/auth/login',
              },
              {
                label: 'Zarejestruj się',
                icon: 'pi pi-user-plus',
                routerLink: '/auth/register',
              },
            ];

      this.categories = this.categoryStore.categories().map((category) => ({
        label: category.name,
        routerLink: '/ksiazki',
        queryParams: { category: category.name },
      }));
    });
  }
}
