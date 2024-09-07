import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  OnInit,
} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavComponent } from './components/nav/nav.component';
import { ToastModule } from 'primeng/toast';
import { Store } from '@ngrx/store';
import {
  categoryActions,
  selectCategories,
  selectError,
  selectLoading,
} from '@e-commerce/client-web/shared/data-access';
import { CategoriesComponent } from './components/categories/categories.component';
import { CartSidebarComponent } from '@e-commerce/client-web/cart/feature/cart-sidebar';
import { AsyncPipe } from '@angular/common';
import {
  authActions,
  selectEvent,
  selectIsAuthenticated,
  selectRefreshToken,
} from '@e-commerce/client-web/auth/data-access';
import { cartActions } from '@e-commerce/client-web/cart/data-access';
import { jwtDecode } from 'jwt-decode';

@Component({
  standalone: true,
  imports: [
    RouterOutlet,
    NavComponent,
    ToastModule,
    CategoriesComponent,
    AsyncPipe,
    CartSidebarComponent,
  ],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit {
  private store = inject(Store);

  public categories$ = this.store.select(selectCategories);
  public loading$ = this.store.select(selectLoading);
  public error$ = this.store.select(selectError);
  public event = this.store.selectSignal(selectEvent);
  public isAuthenticated = this.store.selectSignal(selectIsAuthenticated);
  public refreshToken = this.store.selectSignal(selectRefreshToken);

  constructor() {
    effect(
      () => {
        if (this.event() === 'auth-success') {
          this.store.dispatch(cartActions.getShoppingSession());
        }
        if (this.event() === 'logout-success') {
          this.store.dispatch(cartActions.clearCart());
        }
      },
      { allowSignalWrites: true },
    );
  }

  public ngOnInit(): void {
    this.store.dispatch(categoryActions.getCategories());

    if (this.refreshToken()) {
      const { exp } = jwtDecode(this.refreshToken() ?? '');
      const expirationTime = (exp ?? 0) * 1000 - 60000;

      if (expirationTime <= Date.now()) {
        this.logout();
      }
    }
  }

  public logout() {
    this.store.dispatch(authActions.logout());
  }
}
