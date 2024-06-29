import { AsyncPipe, NgStyle } from '@angular/common';
import {
  Component,
  DestroyRef,
  HostBinding,
  OnInit,
  computed,
  inject,
  signal,
} from '@angular/core';
import { CartStore } from '@e-commerce/client-web-app/shared/data-access/cart';
import { AuthStore } from '@e-commerce/client-web-app/shared/data-access/auth';
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
import { catchError, ignoreElements, of, tap } from 'rxjs';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { MenuItem } from 'primeng/api';
import { PanelModule } from 'primeng/panel';
import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { TooltipModule } from 'primeng/tooltip';

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
  ],
  template: `
    @if ({book: book$ | async, error: bookError$ | async}; as vm) { @if
    (!vm.book && !vm.error) {
    <div>Loading...</div>
    } @else if (!vm.book && vm.error) {
    <div>{{ vm.error }}</div>
    } @else if (vm.book && !vm.error) {
    <div
      class="flex flex-column-reverse gap-3 xl:grid xl:flex-row xl:mb-0 xl:gap-8 height-content"
    >
      <div
        class="border-round overflow-hidden flex align-items-start h-full xl:col-6 xl:justify-content-end"
      >
        <img
          class="sticky top-0 border-round overflow-hidden object-fit-cover object-position-center w-full h-full"
          [src]="vm.book.coverImage"
          alt="book store"
        />
      </div>
      <div class="xl:col-6 h-full flex flex-column gap-8">
        <div class="flex flex-column xl:flex-row gap-4 xl:gap-8 w-full">
          <div class="w-full flex flex-column justify-content-center">
            <p-breadcrumb [model]="breadcrumbItems" />
            <h3 class="text-5xl">{{ vm.book.title }}</h3>
            <div class="flex flex-wrap gap-3 mb-5">
              @for (author of vm.book.authors; track author.id) {
              <div class="text-2xl flex flex-wrap text-color-secondary">
                {{ author.name }}
              </div>
              }
            </div>
            <div class="price-container flex flex-column my-6 gap-2 lg:gap-6">
              <span class="text-4xl font-bold">{{ vm.book.price }}$</span>
              <div class="flex align-items-center gap-4">
                <p-inputNumber
                  [showButtons]="true"
                  [formControl]="amount"
                  [size]="4"
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
                    class="w-full"
                    label="Add to cart"
                    size="large"
                    icon="pi pi-cart-plus"
                    [disabled]="amount.invalid"
                    [loading]="loading() && bookIds().includes(vm.book.id)"
                    (onClick)="addToCart(vm.book)"
                  />
                </div>
              </div>
              <span>
                {{
                  productInventory()?.quantity !== 1
                    ? 'There are ' +
                      productInventory()?.quantity +
                      ' pieces left'
                    : 'Hurry up! Only one piece left'
                }}
              </span>
            </div>
            <div class="flex align-items-center gap-2">
              <span>Category:</span>
              <div class="text-xl">{{ vm.book.category.name }}</div>
            </div>
            @if (!!vm.book.pages) {
            <div class="flex align-items-center gap-2">
              <span>Pages:</span>
              <div class="text-xl">{{ vm.book.pages }}</div>
            </div>
            } @else if (!!vm.book.language) {
            <div class="flex align-items-center gap-2">
              <span>Language:</span>
              <div class="text-xl">{{ vm.book.language }}</div>
            </div>
            } @else if (!!vm.book.publishedDate) {
            <div class="flex align-items-center gap-2">
              <span>Publish date:</span>
              <div class="text-xl">{{ vm.book.publishedDate }}</div>
            </div>
            }
          </div>
        </div>
        <p-panel header="Description" class="max-w-60rem" [toggleable]="true">
          <p class="line-height-3 description">{{ vm.book.description }}</p>
        </p-panel>
      </div>
    </div>
    } }
  `,
  styles: [
    `
      .description {
        letter-spacing: 1px;
      }

      .price-container {
        max-width: 35rem;
      }
      :host ::ng-deep #integeronly {
        text-align: center;
        width: 4rem;
      }
    `,
  ],
})
export class BookDetailsComponent implements OnInit {
  private booksApi = inject(BooksApiService);
  private productInventoryApi = inject(ProductInventoryApiService);
  private route = inject(ActivatedRoute);
  private cartStore = inject(CartStore);
  private authStore = inject(AuthStore);
  private destroyRef = inject(DestroyRef);

  @HostBinding('class') class = 'mx-auto flex flex-column gap-4 relative';

  amount = new FormControl<number>(1, {
    validators: [Validators.min(1)],
  });

  isAuthenticated = computed(() => !!this.authStore.tokens());
  loading = this.cartStore.loading;
  bookIds = this.cartStore.bookIds;

  book$ = this.booksApi.getBook$(
    this.route.snapshot.params[appRouterConfig.browse.bookId]
  );
  bookError$ = this.book$.pipe(
    tap((book) => {
      this.breadcrumbItems.push({
        label: book.category.name,
        routerLink: browseRoutePaths.default,
        state: { categoryIds: [book.category.id], clear: true },
        queryParams: {
          [appRouterConfig.browse.categoriesQueryParams]: book.category.name,
        },
      });
      this.breadcrumbItems.push({ label: book.title });
    }),
    ignoreElements(),
    catchError((responseError: ResponseError) =>
      of(responseError.error.message)
    )
  );
  productInventory = signal<ProductInventory | null>(null);

  breadcrumbItems: MenuItem[] = [
    { label: 'home', routerLink: homeRoutePaths.default },
    {
      label: 'books',
      routerLink: browseRoutePaths.default,
    },
  ];

  ngOnInit(): void {
    this.productInventoryApi
      .getProductInventory(
        this.route.snapshot.params[appRouterConfig.browse.bookId]
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
    // if (this.isAuthenticated()) {
    this.cartStore.addItemToCart({
      book: book,
      quantity: this.amount.value ?? 1,
    });
    // } else {
    //   const cartItems = (JSON.parse(localStorage.getItem('cart') ?? '') ||
    //     []) as {
    //     book: Book;
    //     quantity: number;
    //   }[];
    //
    //   localStorage.setItem(
    //     'cart',
    //     JSON.stringify([...cartItems, { book, quantity: this.amount.value }])
    //   );
    // }
  }

  onBlurInput() {
    if (!this.amount.value) {
      this.amount.setValue(1);
    }
  }
}
