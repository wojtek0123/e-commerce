import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  signal,
  untracked,
} from '@angular/core';
import { BookStore } from '@e-commerce/client-web/browse/data-access';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import {
  CurrencyPipe,
  DatePipe,
  NgClass,
  NgOptimizedImage,
  NgTemplateOutlet,
} from '@angular/common';
import { InputNumberModule } from 'primeng/inputnumber';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { MenuItem } from 'primeng/api';
import { DetailRowComponent } from '@e-commerce/client-web/browse/ui';
import { CartService } from '@e-commerce/client-web/cart/api';
import { BookDetails } from '@e-commerce/shared/api-models';
import { SkeletonModule } from 'primeng/skeleton';
import { SkeletonDirective } from './directives/skeleton.directive';
import { APP_ROUTE_PATHS_TOKEN } from '@e-commerce/client-web/shared/app-config';
import { TooltipModule } from 'primeng/tooltip';
import { TagModule } from 'primeng/tag';
import { MessageModule } from 'primeng/message';

@Component({
  selector: 'lib-book',
  standalone: true,
  imports: [
    NgClass,
    BreadcrumbModule,
    TagModule,
    CurrencyPipe,
    InputNumberModule,
    ButtonModule,
    DetailRowComponent,
    DatePipe,
    SkeletonModule,
    SkeletonDirective,
    TooltipModule,
    MessageModule,
    NgTemplateOutlet,
    FormsModule,
    NgOptimizedImage,
  ],
  templateUrl: './book.component.html',
  styleUrl: './book.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookComponent {
  #bookStore = inject(BookStore);
  #cartService = inject(CartService);
  #appRoutePaths = inject(APP_ROUTE_PATHS_TOKEN);

  book = this.#bookStore.book;
  loading = this.#bookStore.loading;
  error = this.#bookStore.error;
  availableQuantity = this.#bookStore.availableQuantity;
  breadcrumbs = computed<MenuItem[]>(() => [
    { label: 'Home', routerLink: '/' },
    {
      label: 'books',
      routerLink: this.#appRoutePaths.BOOKS(),
    },
    { label: this.book()?.title },
  ]);

  amount = signal(1);
  bookId = input.required<BookDetails['id']>();

  availableQuantityMessage = computed(() =>
    this.availableQuantity() > 1
      ? `There are ${this.availableQuantity()} pieces left`
      : 'Hurry up! Only one piece left',
  );

  constructor() {
    effect(() => {
      const bookId = this.bookId();

      untracked(() => {
        this.#bookStore.getBook$({ bookId });
      });
    });
  }

  onBlurInput() {
    if (!this.amount()) {
      this.amount.set(1);
    }
  }

  isMinAmountInvalid = computed(() => this.amount() < 1);
  isMaxAmountInvalid = computed(() => this.amount() > this.availableQuantity());
  isAmountInvalid = computed(
    () => this.isMinAmountInvalid() || this.isMaxAmountInvalid(),
  );

  addToCart() {
    if (this.isAmountInvalid()) return;

    const book = this.book();

    if (!book) return;

    this.#cartService.addBook(book, this.amount());
  }

  getBook() {
    const bookId = this.bookId();

    this.#bookStore.getBook$({ bookId });
  }

  buyNow() {
    if (this.isAmountInvalid()) return;

    this.addToCart();

    this.#cartService.openDrawer();
  }
}
