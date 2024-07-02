import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  OnInit,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  BookTag,
  Category,
  allBookTags,
} from '@e-commerce/client-web-app/shared/data-access/api-types';
import { ButtonModule } from 'primeng/button';
import { CategoryStore } from '@e-commerce/client-web-app/shared/data-access/category';
import {
  BooksService,
  BooksFilters,
} from '@e-commerce/client-web-app/browse/data-access';
import { FilterSkeletonComponent } from '../components/filter-skeleton/filter-skeleton.component';
import { ActivatedRoute, Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { Accordion, AccordionModule } from 'primeng/accordion';
import { map } from 'rxjs';
import { FilterAccordionTabComponent } from '../components/filter-accordion/filter-accordion.component';
import { appRouterConfig } from '@e-commerce/client-web-app/shared/utils/router-config';
import { NgClass } from '@angular/common';

@Component({
  selector: 'lib-books-filters',
  standalone: true,
  imports: [
    FormsModule,
    ButtonModule,
    FilterSkeletonComponent,
    AccordionModule,
    FilterAccordionTabComponent,
    NgClass,
  ],
  template: `
    <div class="card flex flex-column gap-4 pb-4">
      <p-accordion
        #accordion
        class="flex-column gap-4 filter-container"
        [multiple]="false"
      >
        <lib-filter-accordion-tab
          filterName="tags"
          header="Tagi"
          [items]="tags()"
          [selectedItems]="selectedTags() ?? []"
          (clearEvent)="clearFilter($event)"
          (changeEvent)="updateSelectedTags($event)"
        />
        @if (categoryStatus() === 'ok') {
        <lib-filter-accordion-tab
          filterName="categories"
          header="Kategorie"
          optionLabel="name"
          [items]="categories"
          [selectedItems]="selectedCategories() ?? []"
          (clearEvent)="clearFilter($event)"
          (changeEvent)="updateSelectedCategories($event)"
        />
        } @else if (categoryStatus() === 'loading') {
        <lib-filter-skeleton [numberOfSkeletons]="10" />
        }@else {
        <div>Error</div>
        }
      </p-accordion>
      <p-button
        icon="pi pi-trash"
        label="Clear filters"
        class="w-full mt-2"
        (onClick)="clearFilters()"
      ></p-button>
    </div>
  `,
  styles: [
    `
      :host ::ng-deep {
        .p-listbox .p-listbox-header .p-listbox-filter {
          padding: 0.5rem;
        }

        .p-accordion .p-accordion-content {
          padding: 0;
        }
      }

      .max-h-min {
        max-height: min-content;
      }

      .top-header-height {
        top: calc(var(--header-height) + 1.5rem);
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BooksFiltersComponent implements OnInit {
  private categoryStore = inject(CategoryStore);
  private booksService = inject(BooksService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  @HostBinding('class') class = 'max-w-24rem w-full hidden xl:block';

  categoryStatus = this.categoryStore.status;
  categorySkeletons = new Array(10);

  selectedTags = toSignal(
    this.route.queryParams.pipe(
      map(
        (queryParams) =>
          queryParams[appRouterConfig.browse.tagsQueryParams] as
            | string
            | undefined
      ),
      map((tags) => tags?.split(',') ?? [])
    )
  );
  selectedCategories = toSignal(
    this.route.queryParams.pipe(
      map(
        (queryParams) =>
          queryParams[appRouterConfig.browse.categoriesQueryParams] as
            | Category['name']
            | undefined
      ),
      map((categories) => categories?.replaceAll('_', ' ')?.split(',') ?? []),
      map((categoryNames) =>
        this.categories?.filter((category) =>
          categoryNames.find((name) => category.name === name)
        )
      )
    )
  );

  tags = signal<BookTag[]>([...allBookTags]);
  categories = this.route.snapshot.data[
    appRouterConfig.browse.categoriesData
  ] as Category[];

  accordionElement = viewChild<Accordion>('accordion');

  ngOnInit(): void {
    this.booksService.setCategories(this.categories);
  }

  clearFilters() {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: null,
      queryParamsHandling: 'merge',
      replaceUrl: true,
    });
  }

  clearFilter(filter: keyof BooksFilters) {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        [filter]: null,
      },
      queryParamsHandling: 'merge',
      replaceUrl: true,
    });
  }

  updateSelectedTags(tags: string[]) {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        [appRouterConfig.browse.tagsQueryParams]: tags?.join(',') || null,
      },
      queryParamsHandling: 'merge',
      replaceUrl: true,
    });
  }

  updateSelectedCategories(categories: Category[]) {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        [appRouterConfig.browse.tagsQueryParams]:
          categories.map(({ name }) => name)?.join(',') || null,
      },
      queryParamsHandling: 'merge',
      replaceUrl: true,
    });
  }
}
