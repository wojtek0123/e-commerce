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
import { BooksStore } from '@e-commerce/client-web-app/browse/data-access';
import { FilterSkeletonComponent } from '../components/filter-skeleton/filter-skeleton.component';
import { ActivatedRoute } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

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
  ],
  template: `
    <form
      [formGroup]="filtersForm"
      (submit)="filterBooks()"
      class="flex flex-column gap-4"
    >
      <div
        class="overflow-y-auto flex flex-column gap-4 filter-container sticky top-0"
      >
        <div class="flex flex-column gap-2">
          <h3 class="text-lg m-0 text-center">Tagi</h3>
          <p-listbox
            [options]="tags()"
            optionLabel="name"
            optionValue="value"
            formControlName="selectedTags"
            [filter]="true"
            [checkbox]="true"
            [multiple]="true"
            [listStyle]="{ 'max-height': '13rem', height: '13rem' }"
            (onChange)="onChangeTagFilter($event)"
          />
        </div>
        @if (categoryStatus() === 'ok') {
        <div class="flex flex-column gap-2">
          <h3 class="text-lg m-0 text-center">Kategorie</h3>
          <p-listbox
            [options]="categories"
            optionLabel="name"
            optionVale="id"
            formControlName="selectedCategories"
            [filter]="true"
            [checkbox]="true"
            [multiple]="true"
            [listStyle]="{ 'max-height': '44.5rem', height: '44.5rem' }"
            (onChange)="onChangeCategoryFilter($event)"
          />
        </div>
        } @else if (categoryStatus() === 'loading') {
        <lib-filter-skeleton [numberOfSkeletons]="10" />
        }@else {
        <div>Błąd</div>
        }
      </div>
      <p-button
        label="Filtruj"
        type="submit"
        class="w-full"
        styleClass="p-button-secondary"
      ></p-button>
    </form>
  `,
  styles: [
    `
      :host ::ng-deep {
        .p-listbox .p-listbox-header .p-listbox-filter {
          padding: 0.5rem;
        }
      }

      .filter-container {
        max-height: calc(100svh - var(--header-height) - 12rem);
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

  filtersForm = new FormGroup({
    selectedTags: new FormControl<BookTag[] | null>(null),
    selectedCategories: new FormControl<Category[] | null>(null),
  });

  async ngOnInit() {
    this.categories = this.route.snapshot.data['categories'];

    this.route.queryParams
      .pipe(takeUntilDestroyed(this.destroyRef))
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
          this.filtersForm.setValue({
            selectedCategories: null,
            selectedTags: null,
          });
          history.replaceState({}, '');
        }

        if (selectedCategories?.length) {
          this.filtersForm.patchValue({
            selectedCategories: selectedCategories as Category[],
          });
          this.booksStore.updateFilterCategories(
            selectedCategories as Category[]
          );
        }
        if (tags) {
          this.filtersForm.patchValue({ selectedTags: tags });
          this.booksStore.updateFilterTags(tags ?? null);
        }

        this.booksStore.filterBooks();
      });
  }

  onChangeCategoryFilter(event: ListboxChangeEvent) {
    this.booksStore.updateFilterCategories(event.value);
  }

  onChangeTagFilter(event: ListboxChangeEvent) {
    this.booksStore.updateFilterTags(event.value);
  }

  filterBooks() {
    this.booksStore.filterBooks();
  }
}
