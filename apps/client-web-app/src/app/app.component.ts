import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  OnInit,
  inject,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterOutlet } from '@angular/router';
import { AuthService } from '@e-commerce/client-web-app/shared/data-access/auth';
import { CartService } from '@e-commerce/client-web-app/shared/data-access/cart';
import { PrimeNGConfig } from 'primeng/api';

@Component({
  standalone: true,
  imports: [RouterOutlet],
  selector: 'e-commerce-root',
  template: `<router-outlet />`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit {
  private primengConfig = inject(PrimeNGConfig);
  private authService = inject(AuthService);
  private cartService = inject(CartService);
  private destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    this.primengConfig.zIndex = {
      modal: 1100,
      overlay: 1000,
      menu: 1000,
      tooltip: 1100,
    };
    this.cartService.getCartItemsFromShoppingSession();

    this.authService.events$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((event) => {
        if (event === 'loggedOut') {
          this.cartService.clear();
        }
        if (event === 'loggedIn' || event === 'signedUp') {
          this.cartService.syncDatabase();
        }
      });
  }
}
