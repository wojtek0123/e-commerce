import { Component, inject, OnDestroy, signal, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { DividerModule } from 'primeng/divider';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';
import { Category } from '@e-commerce/client-web/shared/data-access/api-models';
import { FormsModule } from '@angular/forms';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { debounce, filter, map, of, timer } from 'rxjs';
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
import {
  APP_LOCAL_STORAGE_KEYS_TOKEN,
  APP_ROUTE_PATHS_TOKEN,
} from '@e-commerce/client-web/shared/app-config';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [
    RouterLink,
    DividerModule,
    ButtonModule,
    MenuModule,
    RouterLink,
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
      transition('in <=> out', [animate('300ms ease-in-out')]),
    ]),
  ],
})
export class NavComponent implements OnInit, OnDestroy {
  private readonly themeService = inject(ThemeService);
  private readonly categoriesStore = inject(CategoryStore);
  private readonly authService = inject(AuthService);
  private readonly appLocalStorageKeys = inject(APP_LOCAL_STORAGE_KEYS_TOKEN);
  protected readonly appRoutePaths = inject(APP_ROUTE_PATHS_TOKEN);

  public isAuthenticated = this.authService.isAuthenticated;
  public categories = this.categoriesStore.categories;
  public isOpen = signal(false);
  public isExpanded = signal(true);
  public isLabelShowed = toSignal(
    toObservable(this.isExpanded).pipe(
      debounce((isExpanded) => (isExpanded ? timer(150) : of({}))),
    ),
    { initialValue: false },
  );
  public isDark = this.themeService.isDark;

  private resizeObserver?: ResizeObserver;
  private shouldRestoreExpanded = signal(false);

  public ngOnInit() {
    // TODO: Create shared config to all routes and local storage keys
    const isExpanded = localStorage.getItem(
      this.appLocalStorageKeys.IS_EXPANDED,
    );

    if (isExpanded) {
      this.isExpanded.set(JSON.parse(isExpanded));
    }

    const mediaQueryList = matchMedia('(min-width: 1280px)');

    this.resizeObserver = new ResizeObserver(() => {
      if (mediaQueryList.matches && this.shouldRestoreExpanded()) {
        const isExpanded = JSON.parse(
          localStorage.getItem(this.appLocalStorageKeys.IS_EXPANDED) || 'false',
        );

        this.isExpanded.set(isExpanded);
        // this.isLabelShowed.set(isExpanded);
        this.shouldRestoreExpanded.set(false);
      } else if (!mediaQueryList.matches) {
        // this.isLabelShowed.set(true);
        this.isExpanded.set(true);
        this.shouldRestoreExpanded.set(true);
      }
    });

    this.resizeObserver.observe(document.body);
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
      icon: 'pi pi-cog',
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
    localStorage.setItem(
      this.appLocalStorageKeys.IS_EXPANDED,
      JSON.stringify(this.isExpanded()),
    );
  }

  public logout() {
    this.authService.logout();
  }
}
