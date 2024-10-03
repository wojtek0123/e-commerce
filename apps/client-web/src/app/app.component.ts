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
import { categoryActions } from '@e-commerce/client-web/shared/data-access';
import { CartSidebarComponent } from '@e-commerce/client-web/cart/feature/cart-sidebar';
import { AsyncPipe } from '@angular/common';
import {
  authActions,
  selectEvent,
  selectRefreshToken,
} from '@e-commerce/client-web/auth/data-access';
import { cartActions } from '@e-commerce/client-web/cart/data-access';
import { jwtDecode } from 'jwt-decode';
import { PrimeNGConfig } from 'primeng/api';
import { Aura } from 'primeng/themes/aura';
import { definePreset } from 'primeng/themes';

@Component({
  standalone: true,
  imports: [
    RouterOutlet,
    NavComponent,
    ToastModule,
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
  private readonly config = inject(PrimeNGConfig);

  public event = this.store.selectSignal(selectEvent);
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

    const borderRadius = '1rem' as const;
    const MyPreset = definePreset(Aura, {
      semantic: {
        primary: {
          50: '{blue.50}',
          100: '{blue.100}',
          200: '{blue.200}',
          300: '{blue.300}',
          400: '{blue.400}',
          500: '{blue.500}',
          600: '{blue.600}',
          700: '{blue.700}',
          800: '{blue.800}',
          900: '{blue.900}',
          950: '{blue.950}',
        },
      },
      components: {
        button: {
          borderRadius,
        },
      },
    });
    this.config.theme.set({
      preset: MyPreset,
      options: {
        darkModeSelector: '.dark',
        cssLayer: {
          name: 'primeng',
          order: 'tailwind-base, primeng, tailwind-utilities',
        },
      },
    });
  }

  public ngOnInit(): void {
    this.store.dispatch(categoryActions.getCategories());

    if (this.refreshToken()) {
      const { exp } = jwtDecode(this.refreshToken() ?? '');
      const expirationTime = (exp ?? 0) * 1000 - 60000;

      if (expirationTime <= Date.now()) {
        this.store.dispatch(authActions.logout());
      }
    }
  }
}
