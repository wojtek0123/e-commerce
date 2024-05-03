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
import { BooksStore } from '@e-commerce/client-web-app/books/data-access';
import { FilterSkeletonComponent } from '../components/filter-skeleton/filter-skeleton.component';
import { ActivatedRoute, Router } from '@angular/router';
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
            [options]="categories()"
            optionLabel="name"
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
  private router = inject(Router);

  @HostBinding('class') class = 'max-w-24rem w-full hidden xl:block';

  categoryStatus = this.categoryStore.status;
  categories = this.categoryStore.categories;

  categorySkeletons = new Array(10);

  tags = signal<typeof allBookTags>([...allBookTags]);

  filtersForm = new FormGroup({
    selectedTags: new FormControl<BookTag[] | null>(
      this.booksStore.filters.tags()
    ),
    selectedCategories: new FormControl<Category[] | null>(
      this.booksStore.filters.categories()
    ),
  });

  ngOnInit(): void {
    if (this.categoryStatus() !== 'ok') {
      this.categoryStore.getCategories();
    }

    this.route.queryParams
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((param) => {
        const tags = param['tag'] ? [param['tag'] as BookTag] : null;
        const categoryIds = history.state['categoryIds'];

        let selectedCategory: Category | undefined = undefined;

        if (categoryIds) {
          selectedCategory = this.categories().find(
            (c) => c.id === categoryIds[0]
          );
        }

        const clear = history.state['clear'];

        console.log(clear);

        if (clear) {
          this.filtersForm.setValue({
            selectedCategories: selectedCategory ? [selectedCategory] : null,
            selectedTags: tags,
          });

          history.replaceState({}, '');
        } else {
          this.filtersForm.setValue({
            selectedTags: this.booksStore.filters.tags(),
            selectedCategories: this.booksStore.filters.categories(),
          });
        }

        this.booksStore.setFilters({
          tags: this.filtersForm.value.selectedTags,
          categories: this.filtersForm.value.selectedCategories,
        });

        this.router.navigate([], {
          relativeTo: this.route,
          queryParams: {},
        });

        this.booksStore.filterBooks();
      });
  }

  onChangeCategoryFilter(event: ListboxChangeEvent) {
    this.booksStore.setFilters({ categories: event.value });
  }

  onChangeTagFilter(event: ListboxChangeEvent) {
    this.booksStore.setFilters({ tags: event.value });
  }

  filterBooks() {
    this.booksStore.filterBooks();
  }
}
