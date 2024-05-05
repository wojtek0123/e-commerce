import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  HostBinding,
  OnInit,
  inject,
  signal,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { ListboxChangeEvent, ListboxModule } from 'primeng/listbox';
import { SkeletonModule } from 'primeng/skeleton';
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
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AccordionModule } from 'primeng/accordion';
import { BadgeModule } from 'primeng/badge';
import { filter } from 'rxjs';

@Component({
  selector: 'lib-filters',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormsModule,
    ListboxModule,
    ButtonModule,
    SkeletonModule,
    FilterSkeletonComponent,
    AccordionModule,
    BadgeModule,
  ],
  template: `
    <form
      [formGroup]="selectedFiltersForm"
      class="flex flex-column gap-4 sticky top-header-height pb-4"
    >
      <p-accordion class="flex-column gap-4 filter-container">
        <p-accordionTab>
          <ng-template pTemplate="header">
            <span class="font-bold white-space-nowrap">Tagi</span>
            <p-badge
              [value]="(selectedFiltersForm.value.tags?.length ?? 0).toString()"
              class="ml-2"
              styleClass="p-badge-secondary"
            />
            <p-button
              class="ml-3"
              icon="pi pi-trash"
              [text]="true"
              (onClick)="clearFilter($event, 'tags')"
            ></p-button>
          </ng-template>
          <p-listbox
            [options]="tags()"
            optionLabel="name"
            optionValue="value"
            formControlName="tags"
            [filter]="true"
            [checkbox]="true"
            [multiple]="true"
            [listStyle]="{ 'max-height': '13rem', height: '13rem' }"
            (onChange)="onChangeTagFilter($event)"
          />
        </p-accordionTab>
        @if (categoryStatus() === 'ok') {
        <p-accordionTab>
          <ng-template pTemplate="header">
            <span class="font-bold white-space-nowrap">Kategorie</span>
            <p-badge
              [value]="
                (selectedFiltersForm.value.categories?.length ?? 0).toString()
              "
              class="ml-2"
              styleClass="p-badge-secondary"
            />
            <p-button
              class="ml-3"
              icon="pi pi-trash"
              [text]="true"
              (onClick)="clearFilter($event, 'categories')"
            ></p-button>
          </ng-template>
          <p-listbox
            [options]="categories"
            optionLabel="name"
            optionVale="id"
            formControlName="categories"
            [filter]="true"
            [checkbox]="true"
            [multiple]="true"
            [listStyle]="{ 'max-height': 'max-content', height: '100%' }"
            (onChange)="onChangeCategoryFilter($event)"
          />
        </p-accordionTab>
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
        height: 100%;
        max-height: calc(100svh - var(--header-height) - 10rem);
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
  categories: Category[] = [];

  categorySkeletons = new Array(10);

  tags = signal<typeof allBookTags>([...allBookTags]);

  selectedFiltersForm = new FormGroup({
    tags: new FormControl<BookTag[] | null>(null),
    categories: new FormControl<Category[] | null>(null),
  });

  async ngOnInit() {
    this.categories = this.route.snapshot.data['categories'];

    this.route.queryParams
      .pipe(
        filter((params) => params['tags'] || params['categories']),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((param) => {
        const tags = (param['tags'] as BookTag | undefined)?.split(',') as
          | BookTag[]
          | undefined;
        const categoryNames = (
          param['categories'] as Category['name'] | undefined
        )
          ?.split(',')
          .map((c) => c.split('_').join(' '));

        const clear = history.state['clear'];

        const selectedCategories = categoryNames?.length
          ? categoryNames.map((name) =>
              this.categories.find((c) => c.name.toLowerCase() === name)
            )
          : null;

        if (clear) {
          this.booksStore.clearFilters();
          this.selectedFiltersForm.setValue({
            categories: null,
            tags: null,
          });
          history.replaceState({}, '');
        }

        if (selectedCategories?.length) {
          this.selectedFiltersForm.patchValue({
            categories: selectedCategories as Category[],
          });
          this.booksStore.updateFilterCategories(
            selectedCategories as Category[]
          );
        }
        if (tags) {
          this.selectedFiltersForm.patchValue({ tags });
          this.booksStore.updateFilterTags(tags ?? null);
        }

        this.booksStore.getFilterBooks();
      });
  }

  onChangeCategoryFilter(event: ListboxChangeEvent) {
    this.booksStore.updateFilterCategories(event.value);
  }

  onChangeTagFilter(event: ListboxChangeEvent) {
    this.booksStore.updateFilterTags(event.value);
  }

  clearFilters() {
    this.booksStore.clearFilters();

    this.selectedFiltersForm.setValue({
      categories: null,
      tags: null,
    });

    this.booksStore.getFilterBooks();
  }

  clearFilter(event: Event, filter: keyof BooksFilters) {
    event.preventDefault();
    event.stopImmediatePropagation();

    this.selectedFiltersForm.get(filter)?.setValue(null);
    this.booksStore.clearFilter(filter);
    this.booksStore.getFilterBooks();
  }
}
