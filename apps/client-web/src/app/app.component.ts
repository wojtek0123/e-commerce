import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  OnInit,
  untracked,
} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavComponent } from './components/nav/nav.component';
import { ToastModule } from 'primeng/toast';
import { CartSidebarComponent } from '@e-commerce/client-web/cart/feature/cart-sidebar';
import { AsyncPipe } from '@angular/common';
import Aura from '@primeng/themes/aura';
import { definePreset } from '@primeng/themes';
import { AuthService } from '@e-commerce/client-web/auth/api';
import { CartService } from '@e-commerce/client-web/cart/api';
import { PrimeNG } from 'primeng/config';

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
  private readonly authService = inject(AuthService);
  private readonly cartService = inject(CartService);
  private readonly primeng = inject(PrimeNG);

  public event = this.authService.event;

  constructor() {
    effect(() => {
      const event = this.event();

      untracked(() => {
        if (event === 'auth-success' || event === 'init-database') {
          this.cartService.syncCartAndFetchSession();
        }
        if (event === 'logout-success') {
          this.cartService.clearCartAndSession();
        }
        if (event === 'init-local') {
          this.cartService.getLocalCartItems();
        }
      });
    });
  }

  ngOnInit(): void {
    this.primeng.theme.set({
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
}
