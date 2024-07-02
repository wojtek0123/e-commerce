import { Injectable, inject, signal } from '@angular/core';
import { BooksApiService } from '@e-commerce/client-web-app/shared/data-access/api-services';
import {
  BookTag,
  Category,
} from '@e-commerce/client-web-app/shared/data-access/api-types';

@Injectable()
export class BooksService {
  private booksApi = inject(BooksApiService);

  private _categories = signal<Category[]>([]);

  setCategories(categories: Category[]) {
    this._categories.set(categories);
  }

  getBooks$(filters: {
    tags?: string;
    categoryNames?: string;
    search?: string;
  }) {
    const categoryIds = this._categories()
      .filter((category) =>
        filters.categoryNames
          ?.replaceAll('_', ' ')
          .split(',')
          ?.find((name) => name === category.name)
      )
      .map((category) => category.id);

    return this.booksApi.getBooks$({
      tagsIn: filters.tags?.split(',') as BookTag[] | undefined,
      title: filters.search,
      categoryIds: categoryIds,
    });
  }
}
