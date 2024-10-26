import {
  Component,
  computed,
  inject,
  OnDestroy,
  signal,
  OnInit,
} from '@angular/core';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { DividerModule } from 'primeng/divider';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';
import { Category } from '@e-commerce/client-web/shared/data-access';
import { InputSwitchModule } from 'primeng/inputswitch';
import { FormsModule } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, map } from 'rxjs';
import { NgClass, NgTemplateOutlet } from '@angular/common';
import { SidebarModule } from 'primeng/sidebar';
import { ToolbarModule } from 'primeng/toolbar';
import { NavToolbarDirective } from '../../utils/toolbar.directive';
import { SidebarLeftDirective } from '../../utils/sidebar-left.directive';
import { NavButtonDirective } from '@e-commerce/client-web/shared/utils';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { CartSidebarComponent } from '@e-commerce/client-web/cart/feature/cart-sidebar';
import { ThemeService } from '../../services/theme.service';
import { CategoryStore } from '../../stores/category.store';
import { AuthService } from '@e-commerce/client-web/auth/api';

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
    CartSidebarComponent,
  ],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.scss',
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
      transition('in => out', [animate('300ms ease-in-out')]),
      transition('out => in', [animate('300ms ease-in-out')]),
    ]),
  ],
})
export class NavComponent implements OnInit, OnDestroy {
  private readonly themeService = inject(ThemeService);
  private readonly categoriesStore = inject(CategoryStore);
  private readonly authService = inject(AuthService);

  public isAuthenticated = this.authService.isAuthenticated;
  public categories = this.categoriesStore.categories;
  public isOpen = signal(false);
  public isExpanded = signal(true);
  public isLabelShowed = signal(computed(() => this.isExpanded())());
  public isDark = this.themeService.isDark;

  private resizeObserver?: ResizeObserver;
  private timer?: ReturnType<typeof setTimeout>;
  private shouldRestoreExpanded = signal(false);

  public ngOnInit() {
    () => {
      const isExpanded = localStorage.getItem('isExpanded');

      if (isExpanded) {
        this.isExpanded.set(JSON.parse(isExpanded));
        this.isLabelShowed.set(JSON.parse(isExpanded));
      }

      const mediaQueryList = matchMedia('(min-width: 1280px)');

      this.resizeObserver = new ResizeObserver(() => {
        if (mediaQueryList.matches && this.shouldRestoreExpanded()) {
          const isExpanded = JSON.parse(
            localStorage.getItem('isExpanded') || '',
          );

          this.isExpanded.set(isExpanded);
          this.isLabelShowed.set(isExpanded);
          this.shouldRestoreExpanded.set(false);
        } else if (!mediaQueryList.matches) {
          this.isLabelShowed.set(true);
          this.isExpanded.set(true);
          this.shouldRestoreExpanded.set(true);
        }
      });

      this.resizeObserver.observe(document.body);
    };
  }

  public ngOnDestroy(): void {
    this.resizeObserver?.unobserve(document.body);
  }

  public stringifyCategory(category: Category) {
    return JSON.stringify(category);
  }

  protected isAccountRouteActive = toSignal(
    inject(Router).events.pipe(
      filter((events) => events instanceof NavigationEnd),
      map((event) => event.url.includes('account')),
    ),
  );

  // TODO: stworzyć injectionToken dla, aby było jedno źródło danych (app.routes i tutaj)
  public menuItems = signal([
    {
      label: 'Orders',
      icon: 'pi pi-book',
      routerLink: '/account/orders',
    },
    {
      label: 'Information',
      icon: 'pi pi-address-book',
      routerLink: '/account/information',
    },
  ]);

  public toggleDarkMode() {
    this.themeService.toggleDarkMode();
  }

  public toggleNavigation() {
    this.isOpen.update((isOpen) => !isOpen);
  }

  public expandCollapseNavigation() {
    this.isExpanded.update((isExpanded) => !isExpanded);
    localStorage.setItem('isExpanded', JSON.stringify(this.isExpanded()));

    if (this.isExpanded()) {
      this.timer = setTimeout(() => {
        this.isLabelShowed.set(true);
      }, 150);
    } else {
      this.isLabelShowed.set(false);

      if (this.timer) clearTimeout(this.timer);
    }
  }

  public logout() {
    this.authService.logout();
  }
}
