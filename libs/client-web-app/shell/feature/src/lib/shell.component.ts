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
import { NavComponent } from '@e-commerce/client-web-app/shell/ui/nav';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'lib-shell',
  imports: [RouterOutlet, NavComponent, ToastModule],
  template: `
    <lib-e-commerce-nav class="sticky top-0" />
    <p-toast />
    <div class="p-4 min-height-screen mx-auto">
      <router-outlet />
    </div>
  `,
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShellComponent implements OnInit {
  private authService = inject(AuthService);
  private cartService = inject(CartService);
  private destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    this.authService.events$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((event) => {
        if (event === 'init') {
          this.cartService.getCartItems();
        }
        if (event === 'initSession') {
          this.cartService.getCartItemsFromShoppingSession();
        }
        if (event === 'logoutSuccessfully') {
          this.cartService.clear();
        }
        if (event === 'loginSuccessfully' || event === 'registerSuccessfully') {
          this.cartService.syncDatabase();
        }
      });
  }
}
