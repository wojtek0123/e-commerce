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
import { AuthStore } from '@e-commerce/client-web/auth/data-access';
import { CartStore } from '@e-commerce/client-web/cart/data-access';
import { PrimeNGConfig } from 'primeng/api';
import { Aura } from 'primeng/themes/aura';
import { definePreset } from 'primeng/themes';

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
  private readonly cartStore = inject(CartStore);
  private readonly authStore = inject(AuthStore);
  private readonly config = inject(PrimeNGConfig);

  public event = this.authStore.event;

  constructor() {
    effect(() => {
      const event = this.event();

      untracked(() => {
        if (event === 'auth-success') {
          this.cartStore.syncCartsAndFetchSession();
        }
        if (event === 'logout-success') {
          this.cartStore.clearCartAndSession();
        }
        if (event === 'init-local') {
          this.cartStore.getLocalCartItems();
        }
        if (event === 'init-database') {
          this.cartStore.syncCartsAndFetchSession();
        }
      });
    });
  }

  ngOnInit(): void {
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
}
