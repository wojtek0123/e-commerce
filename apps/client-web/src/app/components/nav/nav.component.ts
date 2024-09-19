import {
  Component,
  computed,
  HostBinding,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { NavigationEnd, Params, Router, RouterLink } from '@angular/router';
import { DividerModule } from 'primeng/divider';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';
import { BookTag, Category } from '@e-commerce/client-web/shared/data-access';
import { InputSwitchChangeEvent, InputSwitchModule } from 'primeng/inputswitch';
import { ThemeService, Theme } from '../../services/theme.service';
import { FormsModule } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, map } from 'rxjs';
import { NgClass, NgTemplateOutlet } from '@angular/common';
import { SidebarModule } from 'primeng/sidebar';
import { ToolbarModule } from 'primeng/toolbar';
import { NavToolbarDirective } from '../../utils/toolbar.directive';
import { SidebarLeftDirective } from '../../utils/sidebar-left.directive';
import { NavButtonDirective } from '../../utils/nav-button.directive';

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
    NgClass,
    SidebarModule,
    NgTemplateOutlet,
    ToolbarModule,
    NavToolbarDirective,
    SidebarLeftDirective,
    NavButtonDirective,
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

  isOpen = signal(false);

  public categories = input.required<Category[]>();

  public logoutEvent = output<void>();

  public stringifyCategory(category: Category) {
    return JSON.stringify(category);
  }

  protected isAccountRouteActive = toSignal(
    inject(Router).events.pipe(
      filter((events) => events instanceof NavigationEnd),
      map((event) => event.url.includes('account')),
    ),
  );

  public navItems: {
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
  menuItems = signal([
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
  ]);

  onChangeTheme(event: InputSwitchChangeEvent) {
    const theme: Theme = event.checked ? 'dark' : 'light';

    this.themeSwitcherService.switchTheme(theme);
  }

  public toggleNavigation() {
    this.isOpen.update((isOpen) => !isOpen);
  }
}
