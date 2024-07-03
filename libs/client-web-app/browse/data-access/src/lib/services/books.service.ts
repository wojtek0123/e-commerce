import { Injectable, inject, signal } from '@angular/core';
import { BooksApiService } from '@e-commerce/client-web-app/shared/data-access/api-services';
import {
  BookTag,
  Category,
  Pagination,
} from '@e-commerce/client-web-app/shared/data-access/api-types';

@Injectable()
export class BooksService {
  private booksApi = inject(BooksApiService);

  private _categories = signal<Category[]>([]);

  setCategories(categories: Category[]) {
    this._categories.set(categories);
  }

  getBooks$(
    body: {
      tags?: string;
      categoryNames?: string;
      search?: string;
    } & Pagination
  ) {
    const categoryIds = this._categories()
      .filter((category) =>
        body.categoryNames
          ?.replaceAll('_', ' ')
          .split(',')
          ?.find((name) => name === category.name)
      )
      .map((category) => category.id);

    return this.booksApi.getBooks$({
      tagsIn: body.tags?.split(',') as BookTag[] | undefined,
      title: body.search,
      categoryIds: categoryIds,
      page: body?.page,
      size: body?.size,
    });
  }
}
