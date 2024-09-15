import {
  Component,
  computed,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { Params, RouterLink } from '@angular/router';
import { DividerModule } from 'primeng/divider';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';
import { BookTag } from '@e-commerce/client-web/shared/data-access';
import { InputSwitchChangeEvent, InputSwitchModule } from 'primeng/inputswitch';
import { ThemeService, Theme } from '../../services/theme.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [
    RouterLink,
    DividerModule,
    ButtonModule,
    MenuModule,
    RouterLink,
    InputSwitchModule,
    FormsModule,
  ],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.scss',
})
export class NavComponent {
  private themeSwitcherService = inject(ThemeService);

  public isAuthenticated = input.required<boolean>();

  public theme = computed(() =>
    this.themeSwitcherService.theme() === 'dark' ? true : false,
  )();

  logoutEvent = output<void>();

  navItems: {
    id: BookTag;
    name: string;
    url: string;
    queryParams: Params;
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
  menuItems = computed(() =>
    this.isAuthenticated()
      ? [
          {
            label: 'Orders',
            icon: 'pi pi-book',
            routerLink: '/account/orders',
          },
          {
            label: 'Settings',
            icon: 'pi pi-cog',
            routerLink: '/account/settings',
          },
          {
            label: 'Sign out',
            icon: 'pi pi-sign-out',
            command: () => {
              this.logoutEvent.emit();
            },
          },
        ]
      : [
          {
            label: 'Sign in',
            icon: 'pi pi-sign-in',
            routerLink: '/login',
          },
          {
            label: 'Sign up',
            icon: 'pi pi-user-plus',
            routerLink: '/register',
          },
        ],
  );

  onChangeTheme(event: InputSwitchChangeEvent) {
    const theme: Theme = event.checked ? 'dark' : 'light';

    this.themeSwitcherService.switchTheme(theme);
  }
}
