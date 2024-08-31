import { Component, inject, OnInit, signal } from '@angular/core';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ButtonModule } from 'primeng/button';
import { Store } from '@ngrx/store';
import { cartActions } from '@e-commerce/client-web/cart/data-access';

@Component({
  selector: 'lib-payment-status',
  standalone: true,
  imports: [ProgressSpinnerModule, ButtonModule],
  templateUrl: './payment-status.component.html',
  styleUrl: './payment-status.component.scss',
})
export class PaymentStatusComponent implements OnInit {
  private store = inject(Store);

  paymentStatus = signal(null);
  loading = signal(true);

  ngOnInit(): void {
    this.store.dispatch(cartActions.clearCart());

    setTimeout(() => {
      this.loading.set(false);
    }, 3000);
  }
}
