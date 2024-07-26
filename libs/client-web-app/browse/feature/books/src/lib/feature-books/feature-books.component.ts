import { ChangeDetectionStrategy, Component, HostBinding } from '@angular/core';
import { BooksFiltersComponent } from '@e-commerce/client-web-app/browse/ui/books-filters';
import { BooksSearchComponent } from '@e-commerce/client-web-app/browse/ui/books-search';
import { BooksViewComponent } from '@e-commerce/client-web-app/browse/ui/books-view';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { MenuItem } from 'primeng/api';
import { homeRoutePaths } from '@e-commerce/client-web-app/shared/utils/router-config';
import { BooksActiveFiltersComponent } from '@e-commerce/client-web-app/browse/ui/books-active-filter';

@Component({
  selector: 'lib-feature-books',
  standalone: true,
  imports: [
    BooksFiltersComponent,
    BooksSearchComponent,
    BooksViewComponent,
    BreadcrumbModule,
    BooksActiveFiltersComponent,
  ],
  template: `
    <div class="flex gap-3">
      <lib-books-filters />
      <div class="flex flex-column w-full gap-3">
        <div
          class="flex flex-column w-full lg:flex-row lg:align-items-center justify-content-between gap-4"
        >
          <p-breadcrumb [model]="breadcrumbItems" />
          <lib-books-search class="max-w-30rem w-full" />
        </div>
        <lib-books-active-filters />
        <lib-books-view />
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FeatureBooksComponent {
  breadcrumbItems: MenuItem[] = [
    { label: 'home', routerLink: homeRoutePaths.default },
    {
      label: 'books',
    },
  ];
}
