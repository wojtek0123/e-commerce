import { AsyncPipe, NgStyle } from '@angular/common';
import { Component, HostBinding, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BooksApiService } from '@e-commerce/client-web-app/browse/data-access';
import { ResponseError } from '@e-commerce/client-web-app/shared/data-access/api-types';
import {
  appRouterConfig,
  browseRoutePaths,
  homeRoutePaths,
} from '@e-commerce/client-web-app/shared/utils/router-config';
import { catchError, ignoreElements, of, tap } from 'rxjs';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { MenuItem } from 'primeng/api';
import { PanelModule } from 'primeng/panel';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'lib-book',
  standalone: true,
  imports: [AsyncPipe, BreadcrumbModule, PanelModule, ButtonModule, NgStyle],
  template: `
    @if ({book: book$ | async, error: bookError$ | async}; as vm) { @if
    (!vm.book && !vm.error) {
    <div>Loading...</div>
    } @else if (!vm.book && vm.error) {
    <div>{{ vm.error }}</div>
    } @else if (vm.book && !vm.error) {
    <p-breadcrumb [model]="breadcrumbItems" />
    <div class="flex flex-column xl:flex-row gap-4 xl:gap-8 w-full">
      <img
        class="xl:mr-6"
        [src]="vm.book.coverImage"
        [alt]="vm.book.title + ' cover image'"
      />
      <div class="w-full flex flex-column justify-content-center">
        <h3 class="text-5xl">{{ vm.book.title }}</h3>
        @for (author of vm.book.authors; track author.id) {
        <div class="text-2xl flex flex-wrap mb-5">{{ author.name }}</div>
        }
        <div class="price-container flex flex-column my-6 gap-2 lg:gap-6">
          <span class="text-4xl font-bold">{{ vm.book.price }}$</span>
          <p-button
            class="w-full"
            label="Add to cart"
            icon="pi pi-cart-plus"
            (onClick)="addToCart()"
          ></p-button>
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
    <p-panel header="Description" [toggleable]="true">
      <p class="line-height-3 description">{{ vm.book.description }}</p>
    </p-panel>
    } }
  `,
  styles: [
    `
      .description {
        letter-spacing: 1px;
      }

      .price-container {
        max-width: 80%;
      }
    `,
  ],
})
export class BookComponent {
  private booksApi = inject(BooksApiService);
  private route = inject(ActivatedRoute);

  @HostBinding('class') class = 'mx-auto flex flex-column gap-4 ';
  @HostBinding('style.maxWidth') maxWidth = '80rem';

  book$ = this.booksApi.getBook$(
    this.route.snapshot.params[appRouterConfig.browse.bookId]
  );
  bookError$ = this.book$.pipe(
    tap((book) => this.breadcrumbItems.push({ label: book.title })),
    ignoreElements(),
    catchError((responseError: ResponseError) =>
      of(responseError.error.message)
    )
  );

  breadcrumbItems: MenuItem[] = [
    { label: 'home', routerLink: homeRoutePaths.default },
    {
      label: 'books',
      routerLink: browseRoutePaths.default,
    },
  ];

  addToCart() {
    console.log('Added to cart');
  }
}
