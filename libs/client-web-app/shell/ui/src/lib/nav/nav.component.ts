import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DividerModule } from 'primeng/divider';
import { ButtonModule } from 'primeng/button';
import { Store } from '@ngrx/store';
import { authSelectors } from '@e-commerce/client-web-app/shared/data-access/auth';
import { AsyncPipe } from '@angular/common';
import { MenuItem } from 'primeng/api';
import { MenuModule } from 'primeng/menu';

@Component({
  selector: 'lib-e-commerce-nav',
  standalone: true,
  imports: [RouterLink, DividerModule, ButtonModule, AsyncPipe, MenuModule],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.css',
})
export class NavComponent {
  private store = inject(Store);

  user$ = this.store.select(authSelectors.selectUser);

  items: MenuItem[] = [
    {
      label: 'Log out',
      icon: 'pi pi-sign-out',
      command: () => this.logout(),
    },
  ];

  logout() {
    console.log('logout');
  }
}
