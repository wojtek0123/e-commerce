import { NgOptimizedImage } from '@angular/common';
import {
  afterNextRender,
  Component,
  computed,
  inject,
  Injector,
  Signal,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { BooksGridComponent } from '@e-commerce/client-web/shared/ui';
import {
  Book,
  BookTag,
} from '@e-commerce/client-web/shared/data-access/api-models';
import { APP_ROUTE_PATHS_TOKEN } from '@e-commerce/client-web/shared/app-config';
import { CartService } from '@e-commerce/client-web/cart/api';
import { HomeStore } from '@e-commerce/client-web/home/data-acess';
import { fromEvent, map, startWith, throttleTime } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'lib-home',
  standalone: true,
  imports: [RouterLink, ButtonModule, NgOptimizedImage, BooksGridComponent],
  templateUrl: './home.component.html',
  host: {
    class: 'flex flex-col gap-base',
  },
})
export class HomeComponent {
  protected readonly appRoutePaths = inject(APP_ROUTE_PATHS_TOKEN);
  protected readonly bookTag = BookTag;
  private readonly cartService = inject(CartService);
  private readonly homeStore = inject(HomeStore);
  private readonly injector = inject(Injector);

  public bestsellerBooks = this.homeStore.bestsellersBooks;
  public incomingBooks = this.homeStore.incomingBooks;
  public newBooks = this.homeStore.newBooks;
  public loading = this.homeStore.loading;
  public error = this.homeStore.error;

  public columnsCount?: Signal<any>;

  constructor() {
    afterNextRender(() => {
      this.columnsCount = toSignal(
        fromEvent(window, 'resize').pipe(
          throttleTime(250),
          startWith(window.innerWidth),
          map(() => window.innerWidth),
          map((innerWidth) => {
            if (innerWidth > 3360) return 11;
            if (innerWidth > 3000) return 10;
            if (innerWidth > 2640) return 9;
            if (innerWidth > 2400) return 8;
            if (innerWidth > 2000) return 7;
            if (innerWidth > 1600) return 6;
            if (innerWidth > 1380) return 5;
            if (innerWidth > 1024) return 4;
            if (innerWidth > 768) return 3;
            if (innerWidth > 576) return 2;
            return 1;
          }),
        ),
        { injector: this.injector },
      );
    });
  }

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
      books: computed(() =>
        this.incomingBooks().slice(0, this.columnsCount?.()),
      )(),
    },
    {
      name: this.bookTag.BESTSELLER.toLowerCase(),
      routerLink: this.appRoutePaths.BOOKS(),
      queryParams: { tags: this.bookTag.BESTSELLER },
      books: computed(() =>
        this.bestsellerBooks().slice(0, this.columnsCount?.()),
      )(),
    },
    {
      name: this.bookTag.NEW.toLowerCase(),
      routerLink: this.appRoutePaths.BOOKS(),
      queryParams: { tags: this.bookTag.NEW },
      books: computed(() => this.newBooks().slice(0, this.columnsCount?.()))(),
    },
  ]);

  public addToCart(book: Book) {
    this.cartService.addBook(book, 1);
  }
}
