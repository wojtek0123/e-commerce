import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  HostBinding,
  OnInit,
  computed,
  effect,
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
  BooksStore,
  BooksFilters,
} from '@e-commerce/client-web-app/browse/data-access';
import { FilterSkeletonComponent } from '../components/filter-skeleton/filter-skeleton.component';
import { ActivatedRoute } from '@angular/router';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { Accordion, AccordionModule } from 'primeng/accordion';
import { filter, tap } from 'rxjs';
import { FilterAccordionTabComponent } from '../components/filter-accordion/filter-accordion.component';
import { appRouterConfig } from '@e-commerce/client-web-app/shared/utils/router-config';
import { NgClass } from '@angular/common';

@Component({
  selector: 'lib-filters',
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
    <form class="flex flex-column gap-4 sticky top-header-height pb-4">
      <p-accordion
        #accordion
        [ngClass]="{ 'overflow-y-scroll': !!accordionElement()?.activeIndex }"
        class="flex-column gap-4 filter-container"
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
          [items]="categories()"
          [selectedItems]="selectedCategories() ?? []"
          (clearEvent)="clearFilter($event)"
          (changeEvent)="updateSelectedCategories($event)"
        />
        } @else if (categoryStatus() === 'loading') {
        <lib-filter-skeleton [numberOfSkeletons]="10" />
        }@else {
        <div>Błąd</div>
        }
      </p-accordion>
      <p-button
        icon="pi pi-trash"
        label="Wyczyść filtry"
        class="w-full mt-2"
        (onClick)="clearFilters()"
      ></p-button>
    </form>
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

      .filter-container {
        /* height: 100%; */
        height: calc(100svh - var(--header-height) - 12rem);
      }

      .top-header-height {
        top: calc(var(--header-height) + 1.5rem);
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FiltersComponent implements OnInit {
  private categoryStore = inject(CategoryStore);
  private booksStore = inject(BooksStore);
  private route = inject(ActivatedRoute);
  private destroyRef = inject(DestroyRef);

  @HostBinding('class') class = 'max-w-24rem w-full hidden xl:block';

  categoryStatus = this.categoryStore.status;
  categorySkeletons = new Array(10);

  selectedTags = computed(() => this.booksStore.filters.tags());
  selectedCategories = computed(() => this.booksStore.filters.categories());

  tags = signal<BookTag[]>([...allBookTags]);
  categories = signal<Category[]>([]);

  accordionElement = viewChild<Accordion>('accordion');

  async ngOnInit() {
    this.categories.set(
      this.route.snapshot.data[appRouterConfig.browse.categoriesData]
    );

    this.route.queryParams
      .pipe(
        filter(
          (params) =>
            params[appRouterConfig.browse.tagsQueryParams] ||
            params[appRouterConfig.browse.categoriesQueryParams]
        ),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((param) => {
        const tags = (
          param[appRouterConfig.browse.tagsQueryParams] as BookTag | undefined
        )?.split(',') as BookTag[] | undefined;
        const categoryNames = (
          param[appRouterConfig.browse.categoriesQueryParams] as
            | Category['name']
            | undefined
        )
          ?.split(',')
          .map((c) => c.split('_').join(' '));

        const selectedCategories = categoryNames?.length
          ? categoryNames.map((name) =>
              this.categories().find((c) => c.name.toLowerCase() === name)
            )
          : null;

        if (history.state[appRouterConfig.browse.clearHistoryState]) {
          this.booksStore.clearFilters();
          history.replaceState({}, '');
        }

        if (selectedCategories?.length) {
          this.booksStore.updateFilterCategories(
            selectedCategories as Category[] | null
          );
        }
        this.booksStore.updateFilterTags(tags ?? null);

        this.booksStore.getFilterBooks();
      });
  }

  clearFilters() {
    this.booksStore.clearFilters();
    this.booksStore.getFilterBooks();
  }

  clearFilter(filter: keyof BooksFilters) {
    console.log(filter);
    this.booksStore.clearFilter(filter);
    this.booksStore.getFilterBooks();
  }

  updateSelectedTags(tags: BookTag[]) {
    this.booksStore.updateFilterTags(tags);

    if (!tags.length) this.booksStore.getFilterBooks();
  }

  updateSelectedCategories(categories: Category[]) {
    this.booksStore.updateFilterCategories(categories);

    if (!categories.length) this.booksStore.getFilterBooks();
  }
}
