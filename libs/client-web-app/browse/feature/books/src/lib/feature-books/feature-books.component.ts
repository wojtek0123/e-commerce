import { ChangeDetectionStrategy, Component, HostBinding } from '@angular/core';
import { BooksFiltersComponent } from '@e-commerce/client-web-app/browse/ui/books-filters';
import { BooksSearchComponent } from '@e-commerce/client-web-app/browse/ui/books-search';
import { BooksViewComponent } from '@e-commerce/client-web-app/browse/ui/books-view';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { MenuItem } from 'primeng/api';
import { homeRoutePaths } from '@e-commerce/client-web-app/shared/utils/router-config';

@Component({
  selector: 'lib-feature-books',
  standalone: true,
  imports: [
    BooksFiltersComponent,
    BooksSearchComponent,
    BooksViewComponent,
    BreadcrumbModule,
  ],
  template: `
    <div
      class="flex flex-column lg:flex-row lg:align-items-center justify-content-between gap-4"
    >
      <p-breadcrumb [model]="breadcrumbItems" />
      <lib-books-search class="max-w-30rem w-full" />
    </div>
    <div class="flex w-full xl:gap-5 h-full">
      <lib-books-filters />
      <lib-books-view />
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FeatureBooksComponent {
  @HostBinding('class') class = 'flex flex-column gap-4';
  breadcrumbItems: MenuItem[] = [
    { label: 'home', routerLink: homeRoutePaths.default },
    {
      label: 'books',
    },
  ];
}
