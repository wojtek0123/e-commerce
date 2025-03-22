import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  OnInit,
} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavComponent } from '@e-commerce/client-web/core/feature/nav';
import { ToastModule } from 'primeng/toast';
import Aura from '@primeng/themes/aura';
import { definePreset } from '@primeng/themes';
import { CartService } from '@e-commerce/client-web/cart/api';
import { PrimeNG } from 'primeng/config';
import { MessageBusService } from '@e-commerce/client-web/shared/data-access/services';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

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
  imports: [RouterOutlet, ToastModule, NavComponent],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit {
  #cartService = inject(CartService);
  #primeng = inject(PrimeNG);
  #messageBusService = inject(MessageBusService);
  #destroyRef = inject(DestroyRef);

  event$ = this.#messageBusService.event$;

  ngOnInit(): void {
    this.#primeng.theme.set({
      preset: MyPreset,
      options: {
        darkModeSelector: '.dark',
        cssLayer: {
          name: 'primeng',
          order: 'tailwind-base, primeng, tailwind-utilities',
        },
      },
    });

    this.event$
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe((event) => {
        if (event === 'auth-success' || event === 'init-database') {
          this.#cartService.syncCartAndFetchSession();
        }
        if (event === 'logout-success') {
          this.#cartService.clearCartAndSession();
        }
        if (event === 'init-local') {
          this.#cartService.getLocalCartItems();
        }
        if (event === 'checkout-success') {
          this.#cartService.removeSession();
          this.#cartService.getShoppingSession();
        }
      });
  }
}
