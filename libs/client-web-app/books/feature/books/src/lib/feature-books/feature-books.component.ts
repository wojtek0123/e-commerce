import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FiltersComponent } from '@e-commerce/client-web-app/books/ui/filters';
import { SearchComponent } from '@e-commerce/client-web-app/book/ui/search';
import { BooksViewComponent } from '@e-commerce/client-web-app/books/ui/books-view';

@Component({
  selector: 'lib-feature-books',
  standalone: true,
  imports: [FiltersComponent, SearchComponent, BooksViewComponent],
  template: `
    <div class="flex align-items-center gap-4 mb-4">
      <lib-search />
    </div>
    <div class="flex w-full xl:gap-5 h-full">
      <lib-filters />
      <lib-books-view />
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FeatureBooksComponent {}
