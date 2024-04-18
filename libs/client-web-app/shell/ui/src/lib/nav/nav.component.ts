import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DividerModule } from 'primeng/divider';
import { ButtonModule } from 'primeng/button';
import { Store } from '@ngrx/store';
import {
  authActions,
  authSelectors,
} from '@e-commerce/client-web-app/shared/data-access/auth';
import { AsyncPipe } from '@angular/common';
import { MenuItem } from 'primeng/api';
import { MenuModule } from 'primeng/menu';
import { Observable, map } from 'rxjs';
import { categorySelectors } from '@e-commerce/client-web-app/shared/data-access/category';
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
  ],
  templateUrl: './nav.component.html',
})
export class NavComponent {
  private store = inject(Store);

  categories$: Observable<MenuItem[]> = this.store
    .select(categorySelectors.selectCategories)
    .pipe(
      map((categories) =>
        categories.map((category) => ({ label: category.name }))
      )
    );

  menuItems$: Observable<MenuItem[]> = this.store
    .select(authSelectors.selectTokens)
    .pipe(
      map((tokens) =>
        tokens
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
              command: () => this.store.dispatch(authActions.logout()),
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
          ]
      )
    );
}
