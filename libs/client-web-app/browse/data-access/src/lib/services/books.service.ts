import { Injectable, inject, signal } from '@angular/core';
import { BooksApiService } from '@e-commerce/client-web-app/shared/data-access/api-services';
import {
  BookTag,
  Category,
} from '@e-commerce/client-web-app/shared/data-access/api-types';
import { Subject } from 'rxjs';

@Injectable()
export class BooksService {
  private booksApi = inject(BooksApiService);

  private _categoriesId = signal<Category['id'][]>([]);
  private _tags = signal<BookTag[]>([]);
  private _search = signal<string | null>(null);
  private _minPrice = signal<number | null>(null);
  private _maxPrice = signal<number | null>(null);
  private _filtersHaveChanged$ = new Subject<void>();

  get filtersHaveChanged$() {
    return this._filtersHaveChanged$.asObservable();
  }

  setCategoriesId(ids: Category['id'][]) {
    this._categoriesId.set(ids);
    this._filtersHaveChanged$.next();
  }

  setTags(tags: BookTag[]) {
    this._tags.set(tags);
    this._filtersHaveChanged$.next();
  }

  setSearch(text: string | null) {
    this._search.set(text);
    this._filtersHaveChanged$.next();
  }

  setMinPrice(value: number | null) {
    this._minPrice.set(value);
    this._filtersHaveChanged$.next();
  }

  setMaxPrice(value: number | null) {
    this._maxPrice.set(value);
    this._filtersHaveChanged$.next();
  }

  getBooks$(page: number, size: number) {
    return this.booksApi.getBooks$({
      tagsIn: this._tags(),
      title: this._search() ?? undefined,
      categoryIds: this._categoriesId(),
      priceFrom: this._minPrice(),
      priceTo: this._maxPrice(),
      page,
      size,
    });
  }
}
