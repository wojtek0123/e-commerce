import { CurrencyPipe, NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BookStore } from '@e-commerce/client-web/browse/data-access';
import { CartService } from '@e-commerce/client-web/cart/api';
import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';
import { MessageModule } from 'primeng/message';

@Component({
  selector: 'lib-price-section',
  imports: [
    InputNumberModule,
    FormsModule,
    CurrencyPipe,
    NgClass,
    MessageModule,
    ButtonModule,
  ],
  templateUrl: './price-section.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'flex flex-col gap-12',
  },
})
export class PriceSectionComponent {
  #bookStore = inject(BookStore);
  #cartService = inject(CartService);

  book = this.#bookStore.book;
  availableQuantity = this.#bookStore.availableQuantity;
  loading = this.#bookStore.loading;

  amount = signal(1);

  availableQuantityMessage = computed(() =>
    this.availableQuantity() > 1
      ? `There are ${this.availableQuantity()} pieces left`
      : 'Hurry up! Only one piece left',
  );
  isMinAmountInvalid = computed(() => this.amount() < 1);
  isMaxAmountInvalid = computed(() => this.amount() > this.availableQuantity());
  isAmountInvalid = computed(
    () => this.isMinAmountInvalid() || this.isMaxAmountInvalid(),
  );

  onBlurInput() {
    if (!this.amount()) {
      this.amount.set(1);
    }
  }

  addToCart() {
    if (this.isAmountInvalid()) return;

    const book = this.book();

    if (!book) return;

    this.#cartService.addBook(book, this.amount());
  }

  buyNow() {
    if (this.isAmountInvalid()) return;

    this.addToCart();

    this.#cartService.openDrawer();
  }
}
