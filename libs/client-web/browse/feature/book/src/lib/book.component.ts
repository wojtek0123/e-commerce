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
import { CurrencyPipe, DatePipe, NgTemplateOutlet } from '@angular/common';
import { InputNumberModule } from 'primeng/inputnumber';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { MenuItem } from 'primeng/api';
import { DetailRowComponent } from '@e-commerce/client-web/browse/ui';
import { CartService } from '@e-commerce/client-web/cart/api';
import { BookDetails } from '@e-commerce/client-web/shared/data-access/api-models';
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
    BreadcrumbModule,
    TagModule,
    CurrencyPipe,
    InputNumberModule,
    ReactiveFormsModule,
    ButtonModule,
    DetailRowComponent,
    DatePipe,
    SkeletonModule,
    SkeletonDirective,
    TooltipModule,
    MessageModule,
    NgTemplateOutlet,
  ],
  templateUrl: './book.component.html',
  styleUrl: './book.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookComponent {
  private readonly bookStore = inject(BookStore);
  private readonly cartService = inject(CartService);
  private readonly appRoutePaths = inject(APP_ROUTE_PATHS_TOKEN);

  public book = this.bookStore.book;
  public loading = this.bookStore.loading;
  public error = this.bookStore.error;
  public availableQuantity = this.bookStore.availableQuantity;
  public breadcrumbs = computed<MenuItem[]>(() => [
    {
      label: 'Back',
      routerLink: '../..',
    },
    { label: 'Home', routerLink: '/' },
    {
      label: 'books',
      routerLink: this.appRoutePaths.BOOKS(),
    },
    { label: this.book()?.title },
  ]);
  public amount = new FormControl<number>(1, {
    validators: [Validators.min(1)],
    nonNullable: true,
  });
  public bookId = input.required<BookDetails['id']>();

  availableQuantityMessage = computed(() =>
    this.availableQuantity() > 1
      ? `There are ${this.availableQuantity()} pieces left`
      : 'Hurry up! Only one piece left',
  );

  constructor() {
    effect(() => {
      const bookId = this.bookId();

      untracked(() => {
        this.bookStore.getBook$({ bookId });
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
    if (this.amount.invalid) return;

    const book = this.book();

    if (!book) return;

    this.cartService.addBook(book, this.amount.value);
  }

  public getBook() {
    const bookId = this.bookId();

    this.bookStore.getBook$({ bookId });
  }

  buyNow() {
    this.addToCart();

    this.cartService.openDrawer();
  }
}
