import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  OnInit,
} from '@angular/core';
import { NavigationEnd, RouterOutlet } from '@angular/router';
import { NavComponent } from '@e-commerce/client-web/core/feature/nav';
import { ToastModule } from 'primeng/toast';
import Aura from '@primeng/themes/aura';
import { definePreset } from '@primeng/themes';
import { CartService } from '@e-commerce/client-web/cart/api';
import { PrimeNG } from 'primeng/config';
import { MessageBusService } from '@e-commerce/client-web/shared/data-access/services';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { FavouriteBooksListService } from '@e-commerce/client-web/account/api';
import { UnauthorizedDialogComponent } from './components/unauthorized-dialog/unauthorized-dialog.component';
import { Meta } from '@angular/platform-browser';
import { defaultDescription } from '@e-commerce/client-web/shared/utils';
import { FooterComponent } from '@e-commerce/client-web/core/feature/footer';
import { Router } from '@angular/router';
import { filter, map } from 'rxjs';
import { tap } from 'lodash-es';
import { APP_ROUTES_FEATURE } from '@e-commerce/client-web/shared/app-config';

const borderRadius = '1rem' as const;
const Noir = definePreset(Aura, {
  components: {
    button: {
      borderRadius,
    },
  },
  semantic: {
    primary: {
      50: '{zinc.50}',
      100: '{zinc.100}',
      200: '{zinc.200}',
      300: '{zinc.300}',
      400: '{zinc.400}',
      500: '{zinc.500}',
      600: '{zinc.600}',
      700: '{zinc.700}',
      800: '{zinc.800}',
      900: '{zinc.900}',
      950: '{zinc.950}',
    },
    colorScheme: {
      light: {
        primary: {
          color: '{zinc.950}',
          inverseColor: '#ffffff',
          hoverColor: '{zinc.900}',
          activeColor: '{zinc.800}',
        },
        highlight: {
          background: '{zinc.950}',
          focusBackground: '{zinc.700}',
          color: '#ffffff',
          focusColor: '#ffffff',
        },
      },
      dark: {
        primary: {
          color: '{zinc.50}',
          inverseColor: '{zinc.950}',
          hoverColor: '{zinc.100}',
          activeColor: '{zinc.200}',
        },
        highlight: {
          background: 'rgba(250, 250, 250, .16)',
          focusBackground: 'rgba(250, 250, 250, .24)',
          color: 'rgba(255,255,255,.87)',
          focusColor: 'rgba(255,255,255,.87)',
        },
      },
    },
  },
});

@Component({
  standalone: true,
  imports: [
    RouterOutlet,
    ToastModule,
    NavComponent,
    UnauthorizedDialogComponent,
    FooterComponent,
  ],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit {
  #cartService = inject(CartService);
  #favouriteBooksService = inject(FavouriteBooksListService);
  #primeng = inject(PrimeNG);
  #messageBusService = inject(MessageBusService);
  #destroyRef = inject(DestroyRef);
  #meta = inject(Meta);
  #router = inject(Router);
  #appRoutesFeature = APP_ROUTES_FEATURE;

  event$ = this.#messageBusService.event$;

  isCartRouteActive = toSignal(
    this.#router.events.pipe(
      filter((events) => events instanceof NavigationEnd),
      map(({ url }) => url.includes(this.#appRoutesFeature.CART.BASE)),
    ),
  );

  isPaymentStatusActive = toSignal(
    this.#router.events.pipe(
      filter((events) => events instanceof NavigationEnd),
      map(({ url }) =>
        url.includes(this.#appRoutesFeature.CART.PAYMENT_STATUS),
      ),
    ),
  );

  ngOnInit(): void {
    this.#setTheme();
    this.#subscribeToEventChange();
    this.#setPageDescription();
  }

  #setTheme() {
    this.#primeng.theme.set({
      preset: Noir,
      options: {
        darkModeSelector: '.dark',
        cssLayer: {
          name: 'primeng',
          order: 'tailwind-base, primeng, tailwind-utilities',
        },
      },
    });
  }

  #subscribeToEventChange() {
    this.event$
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe((event) => {
        if (event === 'auth-success' || event === 'init-database') {
          this.#cartService.syncCartAndFetchSession();
          this.#favouriteBooksService.getFavouriteBooks();
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

  #setPageDescription() {
    this.#meta.updateTag({
      name: 'description',
      content: defaultDescription,
    });
  }
}
