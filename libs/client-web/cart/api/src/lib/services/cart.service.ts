import { computed, inject, Injectable } from '@angular/core';
import { CartStore } from '@e-commerce/client-web/cart/data-access';
import { Book } from '@e-commerce/client-web/shared/data-access/api-models';

@Injectable({ providedIn: 'root' })
export class CartService {
  private readonly cartStore = inject(CartStore);

  public readonly itemsCount = computed(() => this.cartStore.itemsCount());
  public readonly loading = computed(() => this.cartStore.loading());

  public addBook(book: Book, quantity: number) {
    this.cartStore.addBook({ book, quantity });
  }

  public syncCartAndFetchSession() {
    this.cartStore.syncCartAndFetchSession();
  }

  public clearCartAndSession() {
    this.cartStore.clearCartAndSession();
  }

  public getLocalCartItems() {
    this.cartStore.getLocalCartItems();
  }

  public openDrawer() {
    this.cartStore.openDrawerCart();
  }
}
