import {
  ChangeDetectionStrategy,
  Component,
  inject,
  output,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Category } from '@e-commerce/client-web-app/shared/data-access/api-types';
import { CategoryStore } from '@e-commerce/client-web-app/shared/data-access/category';
import { appRouterConfig } from '@e-commerce/client-web-app/shared/utils/router-config';
import { map, tap } from 'rxjs';
import { FilterSkeletonComponent } from '../filter-skeleton/filter-skeleton.component';
import { FilterAccordionTabComponent } from '../filter-accordion/filter-accordion.component';
import {
  BooksFilters,
  BooksService,
} from '@e-commerce/client-web-app/browse/data-access';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'lib-categories-filter',
  template: `
    @if (loading()) {
      <lib-filter-skeleton [numberOfSkeletons]="3" />
    } @else {
      @if (error()) {
        <div>{{ error() }}</div>
      } @else {
        <lib-filter-accordion-tab
          filterName="categories"
          header="Categories"
          optionLabel="name"
          [items]="categories()"
          [selectedItems]="(selectedItems$ | async) ?? []"
          (clearEvent)="clearFilterEvent.emit($event)"
          (changeEvent)="updateSelectedCategories($event)"
        />
      }
    }
  `,
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FilterSkeletonComponent, FilterAccordionTabComponent, AsyncPipe],
})
export class CategoriesFilterComponent {
  private categoryStore = inject(CategoryStore);
  private booksService = inject(BooksService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  categories = this.categoryStore.categories;
  loading = this.categoryStore.loading;
  error = this.categoryStore.error;

  selectedItems$ = this.route.queryParams.pipe(
    map(
      (queryParams) =>
        queryParams[appRouterConfig.browse.categoriesQueryParams] as
          | Category['name']
          | undefined,
    ),
    map((categories) => categories?.replaceAll('_', ' ')?.split(',') ?? []),
    map((categoryNames) =>
      this.categories()?.filter((category) =>
        categoryNames.find((name) => category.name === name),
      ),
    ),
    tap((categories) => {
      const selectedCategoriesId = categories.map(({ id }) => id);
      this.booksService.setCategoriesId(selectedCategoriesId);
    }),
  );

  clearFilterEvent = output<keyof BooksFilters>();

  updateSelectedCategories(categories: Category[]) {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        [appRouterConfig.browse.categoriesQueryParams]:
          categories.map(({ name }) => name.replaceAll(' ', '_'))?.join(',') ||
          null,
      },
      queryParamsHandling: 'merge',
      replaceUrl: true,
    });
  }
}
