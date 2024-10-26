import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  untracked,
} from '@angular/core';
import { BookStore } from '@e-commerce/client-web/browse/data-access';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { ChipModule } from 'primeng/chip';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { InputNumberModule } from 'primeng/inputnumber';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { MenuItem } from 'primeng/api';
import { DetailRowComponent } from '@e-commerce/client-web/browse/ui';
import { CartService } from '@e-commerce/client-web/cart/api';
import { BookDetails } from '@e-commerce/client-web/shared/data-access';
import { SkeletonModule } from 'primeng/skeleton';
import { SkeletonDirective } from './skeleton.directive';

@Component({
  selector: 'lib-book',
  standalone: true,
  imports: [
    BreadcrumbModule,
    ChipModule,
    CurrencyPipe,
    InputNumberModule,
    ReactiveFormsModule,
    ButtonModule,
    DetailRowComponent,
    DatePipe,
    SkeletonModule,
    SkeletonDirective,
  ],
  templateUrl: './book.component.html',
  styleUrl: './book.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookComponent {
  private readonly bookStore = inject(BookStore);
  private readonly cartService = inject(CartService);

  public book = this.bookStore.book;
  public loading = this.bookStore.loading;
  public error = this.bookStore.error;
  public availableQuantity = this.bookStore.availableQuantity;
  public breadcrumbs = computed<MenuItem[]>(() => [
    { label: 'Home', routerLink: '/' },
    { label: 'books', routerLink: '/browse' },
    {
      label: this.book()?.category.name ?? '',
      routerLink: '/browse',
      queryParams: { categories: this.book()?.category.name },
    },
    { label: this.book()?.title },
  ]);
  public amount = new FormControl<number>(1, {
    validators: [Validators.min(1)],
    nonNullable: true,
  });
  public bookId = input.required<BookDetails['id']>();

  constructor() {
    effect(() => {
      const bookId = this.bookId();

      untracked(() => {
        this.bookStore.getBook({ bookId });
      });
    });

    effect(() => {
      const availableQuantity = this.availableQuantity();

      untracked(() => {
        this.amount.setValidators(Validators.max(availableQuantity));
      });
    });
  }

  public onBlurInput() {
    if (!this.amount.value) {
      this.amount.setValue(1);
    }
  }

  public addToCart() {
    const book = this.book();

    if (!book) return;

    this.cartService.addBook(book, this.amount.value);
  }
}
