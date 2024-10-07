import { Component, inject, OnInit, signal } from '@angular/core';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ButtonModule } from 'primeng/button';
import { CartStore } from '@e-commerce/client-web/cart/data-access';

@Component({
  selector: 'lib-payment-status',
  standalone: true,
  imports: [ProgressSpinnerModule, ButtonModule],
  templateUrl: './payment-status.component.html',
  styleUrl: './payment-status.component.scss',
})
export class PaymentStatusComponent implements OnInit {
  private readonly cartStore = inject(CartStore);

  paymentStatus = signal(null);
  loading = signal(true);

  ngOnInit(): void {
    this.cartStore.deleteSession();

    setTimeout(() => {
      this.loading.set(false);
    }, 3000);
  }
}
