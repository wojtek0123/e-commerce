import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  OnInit,
  computed,
  inject,
  output,
  signal,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoryStore } from '@e-commerce/client-web-app/shared/data-access/category';
import { appRouterConfig } from '@e-commerce/client-web-app/shared/utils/router-config';
import { map } from 'rxjs';
import { FilterSkeletonComponent } from '../filter-skeleton/filter-skeleton.component';
import { FilterAccordionTabComponent } from '../filter-accordion/filter-accordion.component';
import {
  BooksFilters,
  BooksService,
} from '@e-commerce/client-web-app/browse/data-access';
import { AsyncPipe } from '@angular/common';
import { CheckboxModule } from 'primeng/checkbox';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { InputTextModule } from 'primeng/inputtext';

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
          [selectedItemsCount]="selectedItemsControl.value.length"
          (clearEvent)="clearFilterEvent.emit($event)"
        >
          <div class="flex flex-column gap-2">
            <input
              placeholder="Search for categories..."
              pInputText
              [(ngModel)]="searchText"
              class="w-full"
            />
            <div class="flex flex-column gap-2">
              @for (name of categoryNames(); track name) {
                <p-checkbox
                  [formControl]="selectedItemsControl"
                  [label]="name"
                  [value]="name"
                />
              } @empty {
                <div>Not found more categories</div>
              }
            </div>
          </div>
        </lib-filter-accordion-tab>
      }
    }
  `,
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    FilterSkeletonComponent,
    FilterAccordionTabComponent,
    AsyncPipe,
    CheckboxModule,
    FormsModule,
    ReactiveFormsModule,
    InputTextModule,
  ],
})
export class CategoriesFilterComponent implements OnInit {
  private categoryStore = inject(CategoryStore);
  private booksService = inject(BooksService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);

  categoryNames = computed(() =>
    this.categoryStore.categories().map(({ name }) => name),
  );
  loading = this.categoryStore.loading;
  error = this.categoryStore.error;
  searchText = signal<string | null>(null);
  selectedItemsControl = new FormControl<string[]>([], { nonNullable: true });

  clearFilterEvent = output<keyof BooksFilters>();

  ngOnInit(): void {
    this.route.queryParams
      .pipe(
        map(
          (queryParams) =>
            queryParams[appRouterConfig.browse.categoriesQueryParams] as
              | string
              | undefined,
        ),
        map((filter) => filter?.replaceAll('_', ' ').split(',') ?? []),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((categories) => {
        this.selectedItemsControl.setValue(categories);
        this.booksService.setCategoryNames(categories);
      });

    this.selectedItemsControl.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((categoryNames) => {
        this.router.navigate([], {
          relativeTo: this.route,
          queryParams: {
            [appRouterConfig.browse.categoriesQueryParams]:
              categoryNames
                ?.map((name) => name.replaceAll(' ', '_'))
                ?.join(',') || null,
          },
          queryParamsHandling: 'merge',
          replaceUrl: true,
        });
      });
  }
}
