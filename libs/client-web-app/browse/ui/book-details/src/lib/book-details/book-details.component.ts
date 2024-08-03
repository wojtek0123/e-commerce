import { AsyncPipe, CurrencyPipe, DatePipe, NgStyle } from '@angular/common';
import {
  Component,
  DestroyRef,
  OnInit,
  computed,
  inject,
  signal,
} from '@angular/core';
import {
  CartService,
  AuthService,
} from '@e-commerce/client-web-app/shared/data-access/stores';
import { ActivatedRoute } from '@angular/router';
import {
  BooksApiService,
  ProductInventoryApiService,
} from '@e-commerce/client-web-app/shared/data-access/api-services';
import {
  Book,
  ProductInventory,
  ResponseError,
} from '@e-commerce/client-web-app/shared/data-access/api-types';
import {
  appRouterConfig,
  browseRoutePaths,
  homeRoutePaths,
} from '@e-commerce/client-web-app/shared/utils/router-config';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Observable, catchError, ignoreElements, map, of } from 'rxjs';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { MenuItem } from 'primeng/api';
import { PanelModule } from 'primeng/panel';
import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { TooltipModule } from 'primeng/tooltip';
import { ChipModule } from 'primeng/chip';
import { DetailRowComponent } from './components/detail-row.component';

@Component({
  selector: 'lib-book-details',
  standalone: true,
  imports: [
    AsyncPipe,
    BreadcrumbModule,
    PanelModule,
    ButtonModule,
    NgStyle,
    InputNumberModule,
    ReactiveFormsModule,
    TooltipModule,
    CurrencyPipe,
    ChipModule,
    DetailRowComponent,
    DatePipe,
  ],
  template: `
    @if ({ book: book$ | async, error: bookError$ | async }; as vm) {
      @if (!vm.book && !vm.error) {
        <div>Loading...</div>
      } @else if (!vm.book && vm.error) {
        <div>{{ vm.error }}</div>
      } @else if (vm.book && !vm.error) {
        <div class="container">
          <div
            class="image surface-hover border-round w-full max-height top-header-height flex align-items-center justify-content-center"
          >
            <img
              class="border-round h-full"
              [src]="vm.book.coverImage"
              [alt]="vm.book.title + ' cover image'"
            />
          </div>
          <div class="flex flex-column gap-8">
            <div class="flex flex-column xl:flex-row gap-4 xl:gap-8 w-full">
              <div class="w-full flex flex-column justify-content-center">
                <p-breadcrumb
                  class="overflow-hidden"
                  [model]="(breadcrumbItems$ | async) ?? []"
                />
                <h3 class="text-5xl md:text-6xl lg:text-7xl xl:text-8xl">
                  {{ vm.book.title }}
                </h3>
                <div class="flex flex-wrap gap-3 mb-5">
                  @for (author of vm.book.authors; track author.id) {
                    <div class="text-2xl flex flex-wrap text-color-secondary">
                      {{ author.name }}
                    </div>
                  }
                </div>
                @if (vm.book.tag) {
                  <p-chip [label]="vm.book.tag" />
                }
                <div class="flex flex-column my-6 gap-2">
                  <span class="text-4xl font-bold">
                    {{ vm.book.price | currency: 'USD' }}
                  </span>
                  <div
                    class="flex justify-content-between sm:justify-content-start align-items-center gap-4"
                  >
                    <p-inputNumber
                      [showButtons]="true"
                      [formControl]="amount"
                      [size]="6"
                      [min]="1"
                      (onBlur)="onBlurInput()"
                      buttonLayout="horizontal"
                      spinnerMode="horizontal"
                      inputId="integeronly"
                      decrementButtonClass="p-button-text p-button-secondary"
                      incrementButtonClass="p-button-text p-button-secondary"
                      incrementButtonIcon="pi pi-plus"
                      decrementButtonIcon="pi pi-minus"
                    />
                    <div
                      [pTooltip]="
                        amount.invalid ? 'Make sure that amount is correct' : ''
                      "
                      tooltipPosition="top"
                      tooltipStyleClass="min-w-max"
                    >
                      <p-button
                        class="w-full xl:hidden"
                        label="Add to cart"
                        icon="pi pi-cart-plus"
                        [disabled]="amount.invalid"
                        [loading]="loading() && bookIds().includes(vm.book.id)"
                        (onClick)="addToCart(vm.book)"
                      />
                      <p-button
                        class="w-full hidden xl:block"
                        label="Add to cart"
                        icon="pi pi-cart-plus"
                        size="large"
                        [disabled]="amount.invalid"
                        [loading]="loading() && bookIds().includes(vm.book.id)"
                        (onClick)="addToCart(vm.book)"
                      />
                    </div>
                  </div>
                  <span class="text-xs font-semibold">
                    {{
                      productInventory()?.quantity !== 1
                        ? 'There are ' +
                          productInventory()?.quantity +
                          ' pieces left'
                        : 'Hurry up! Only one piece left'
                    }}
                  </span>
                </div>
                <div class="flex flex-column gap-2">
                  <lib-detail-row
                    label="Category"
                    [value]="vm.book.category.name"
                  />
                  @if (vm.book.pages) {
                    <lib-detail-row label="Pages" [value]="vm.book.pages" />
                  }
                  @if (vm.book.language) {
                    <lib-detail-row
                      label="Language"
                      [value]="vm.book.language"
                    />
                  }
                  @if (vm.book.publishedDate) {
                    <lib-detail-row
                      label="Publish date"
                      [value]="vm.book.publishedDate | date"
                    />
                  }
                </div>
              </div>
            </div>
            <p-panel header="Description" [toggleable]="true">
              <p class="line-height-3 description">
                {{ vm.book.description }}
              </p>
            </p-panel>
          </div>
        </div>
      }
    }
  `,
  styleUrl: './book-details.component.css',
})
export class BookDetailsComponent implements OnInit {
  private booksApi = inject(BooksApiService);
  private productInventoryApi = inject(ProductInventoryApiService);
  private route = inject(ActivatedRoute);
  private authService = inject(AuthService);
  private cartService = inject(CartService);
  private destroyRef = inject(DestroyRef);

  amount = new FormControl<number>(1, {
    validators: [Validators.min(1)],
  });

  isAuthenticated = computed(() => !!this.authService.tokens());
  loading = this.cartService.loading;
  bookIds = this.cartService.addingBookIds;

  book$ = this.booksApi.getBook$(
    this.route.snapshot.params[appRouterConfig.browse.bookId],
  );
  bookError$ = this.book$.pipe(
    ignoreElements(),
    catchError((responseError: ResponseError) =>
      of(responseError.error.message),
    ),
  );
  productInventory = signal<ProductInventory | null>(null);

  breadcrumbItems$: Observable<MenuItem[]> = this.book$.pipe(
    map((book) => [
      { label: 'home', routerLink: homeRoutePaths.default },
      {
        label: 'books',
        routerLink: browseRoutePaths.default,
      },
      {
        label: book.category.name,
        routerLink: browseRoutePaths.default,
        state: { categoryIds: [book.category.id], clear: true },
        queryParams: {
          [appRouterConfig.browse.categoriesQueryParams]: book.category.name,
        },
      },
      { label: book.title },
    ]),
  );

  ngOnInit(): void {
    this.productInventoryApi
      .getProductInventory(
        this.route.snapshot.params[appRouterConfig.browse.bookId],
      )
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (productInventory) => {
          this.productInventory.set(productInventory);
          this.amount.setValidators(Validators.max(productInventory.quantity));
        },
      });
  }

  addToCart(book: Book) {
    this.cartService.addItem(book, this.amount.value ?? 1);
  }

  onBlurInput() {
    if (!this.amount.value) {
      this.amount.setValue(1);
    }
  }
}
