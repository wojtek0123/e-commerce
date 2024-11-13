import { NgOptimizedImage } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import {
  BookCardComponent,
  BooksGridComponent,
} from '@e-commerce/client-web/shared/ui';
import {
  Book,
  BookTag,
} from '@e-commerce/client-web/shared/data-access/api-models';
import { SkeletonBooksSectionComponent } from '@e-commerce/client-web/home/ui';
import { APP_ROUTE_PATHS_TOKEN } from '@e-commerce/client-web/shared/app-config';
import { CartService } from '@e-commerce/client-web/cart/api';
import { HomeStore } from '@e-commerce/client-web/home/data-acess';

@Component({
  selector: 'lib-home',
  standalone: true,
  imports: [
    RouterLink,
    ButtonModule,
    NgOptimizedImage,
    BookCardComponent,
    SkeletonBooksSectionComponent,
    BooksGridComponent,
  ],
  templateUrl: './home.component.html',
})
export class HomeComponent {
  protected readonly appRoutePaths = inject(APP_ROUTE_PATHS_TOKEN);
  protected readonly bookTag = BookTag;
  private readonly cartService = inject(CartService);
  private readonly homeStore = inject(HomeStore);

  public bestsellerBooks = this.homeStore.bestsellersBooks;
  public incomingBooks = this.homeStore.incomingBooks;
  public newBooks = this.homeStore.newBooks;
  public loading = this.homeStore.loading;
  public error = this.homeStore.error;

  public sections = computed<
    Array<{
      name: string;
      books: Book[];
      routerLink: string;
      queryParams: { tags: BookTag };
    }>
  >(() => [
    {
      name: this.bookTag.INCOMING.toLowerCase(),
      routerLink: this.appRoutePaths.BOOKS(),
      queryParams: { tags: this.bookTag.INCOMING },
      books: this.incomingBooks(),
    },
    {
      name: this.bookTag.BESTSELLER.toLowerCase(),
      routerLink: this.appRoutePaths.BOOKS(),
      queryParams: { tags: this.bookTag.BESTSELLER },
      books: this.bestsellerBooks(),
    },
    {
      name: this.bookTag.NEW.toLowerCase(),
      routerLink: this.appRoutePaths.BOOKS(),
      queryParams: { tags: this.bookTag.NEW },
      books: this.newBooks(),
    },
  ]);

  public addToCart(book: Book) {
    this.cartService.addBook(book, 1);
  }
}
