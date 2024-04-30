import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BooksStore } from '@e-commerce/client-web-app/books/data-access';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { BookTag } from '@e-commerce/client-web-app/shared/data-access/api-types';
import { SkeletonModule } from 'primeng/skeleton';

@Component({
  selector: 'lib-client-web-app-books-feature-books',
  standalone: true,
  imports: [CardModule, ButtonModule, SkeletonModule],
  templateUrl: './client-web-app-books-feature-books.component.html',
  styleUrl: './client-web-app-books-feature-books.component.css',
})
export class ClientWebAppBooksFeatureBooksComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private booksStore = inject(BooksStore);

  books = this.booksStore.books;
  status = this.booksStore.status;
  skeletons = new Array(12);

  ngOnInit(): void {
    this.route.queryParamMap.subscribe((param) => {
      const tag = param.get('tag') as BookTag;
      const categoryIds = history.state['categoryIds'];
      console.log(tag);
      this.booksStore.getBooks({ tag, categoryIds });
    });
  }
}
