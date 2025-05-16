import { NgOptimizedImage } from '@angular/common';
import {
  afterNextRender,
  Component,
  computed,
  ElementRef,
  inject,
  OnDestroy,
  signal,
  viewChild,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { FavouriteBooksListService } from '@e-commerce/client-web/account/api';
import { CartService } from '@e-commerce/client-web/cart/api';
import { HomeStore } from '@e-commerce/client-web/home/data-acess';
import { APP_ROUTE_PATHS_TOKEN } from '@e-commerce/client-web/shared/app-config';
import { BooksGridComponent } from '@e-commerce/client-web/shared/ui';
import { Book, BookTag } from '@e-commerce/shared/api-models';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'lib-home',
  standalone: true,
  imports: [RouterLink, ButtonModule, NgOptimizedImage, BooksGridComponent],
  templateUrl: './home.component.html',
  host: {
    class: 'flex flex-col gap-base',
  },
})
export class HomeComponent implements OnDestroy {
  #appRoutePaths = inject(APP_ROUTE_PATHS_TOKEN);
  #cartService = inject(CartService);
  #homeStore = inject(HomeStore);

  #favouriteBooksListService = inject(FavouriteBooksListService);

  booksUrl = this.#appRoutePaths.BOOKS();
  bestsellerBooks = this.#homeStore.bestsellersBooks;
  faqUrl = this.#appRoutePaths.FAQ();
  incomingBooks = this.#homeStore.incomingBooks;
  newBooks = this.#homeStore.newBooks;
  loading = this.#homeStore.loading;
  error = this.#homeStore.error;

  favouriteBooks = this.#favouriteBooksListService.favouriteBooks;

  bookTag = BookTag;

  columnsCount = signal(0);

  booksContainerRef = viewChild.required(BooksGridComponent, {
    read: ElementRef,
  });

  resizeObserver = signal<ResizeObserver | undefined>(undefined);
  resizeTimeout = signal<number | null>(null);

  constructor() {
    afterNextRender(() => {
      this.resizeObserver.set(
        new ResizeObserver((entries) => {
          if (this.resizeTimeout()) return;
          this.resizeTimeout.set(
            requestAnimationFrame(() => {
              for (const entry of entries) {
                const width = entry.contentRect.width;
                this.columnsCount.set(this.calculateColumns(width));
              }

              this.resizeTimeout.set(null);
            }),
          );
        }),
      );

      this.resizeObserver()?.observe(this.booksContainerRef().nativeElement);

      this.columnsCount.set(
        this.calculateColumns(
          this.booksContainerRef().nativeElement.getBoundingClientRect().width,
        ),
      );
    });
  }

  sections = computed<
    Array<{
      name: string;
      books: Book[];
      routerLink: string;
      queryParams: { tags: BookTag };
    }>
  >(() => [
    {
      name: this.bookTag.INCOMING.toLowerCase(),
      routerLink: this.#appRoutePaths.BOOKS(),
      queryParams: { tags: this.bookTag.INCOMING },
      books: this.incomingBooks().slice(0, this.columnsCount?.()),
    },
    {
      name: this.bookTag.BESTSELLER.toLowerCase(),
      routerLink: this.#appRoutePaths.BOOKS(),
      queryParams: { tags: this.bookTag.BESTSELLER },
      books: this.bestsellerBooks().slice(0, this.columnsCount?.()),
    },
    {
      name: this.bookTag.NEW.toLowerCase(),
      routerLink: this.#appRoutePaths.BOOKS(),
      queryParams: { tags: this.bookTag.NEW },
      books: this.newBooks().slice(0, this.columnsCount?.()),
    },
  ]);

  addToCart(book: Book) {
    this.#cartService.addBook(book, 1);
  }

  addBookToFavourite({ id }: Book) {
    this.#favouriteBooksListService.addBookToFavourite(id);
  }

  retry() {
    this.#homeStore.getBooks();
  }

  calculateColumns(width: number) {
    const breakpoints = [
      3360, 3000, 2640, 2400, 2000, 1280, 1152, 896, 672, 448,
    ];

    const columns = [11, 10, 9, 8, 7, 6, 5, 4, 3, 2];

    for (let i = 0; i < breakpoints.length; i++) {
      if (width >= breakpoints[i]) return columns[i];
    }
    return 1;
  }

  ngOnDestroy(): void {
    this.resizeObserver()?.disconnect();
  }
}
