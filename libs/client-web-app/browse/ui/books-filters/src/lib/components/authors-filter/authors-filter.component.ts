import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  OnInit,
  inject,
  signal,
} from '@angular/core';
import { AuthorApiService } from '@e-commerce/client-web-app/shared/data-access/api-services';
import { FilterSkeletonComponent } from '../filter-skeleton/filter-skeleton.component';
import { FilterAccordionTabComponent } from '../filter-accordion/filter-accordion.component';
import { AsyncPipe } from '@angular/common';
import {
  catchError,
  debounce,
  ignoreElements,
  map,
  of,
  switchMap,
  timer,
} from 'rxjs';
import { ResponseError } from '@e-commerce/client-web-app/shared/data-access/api-types';
import { ActivatedRoute, Router } from '@angular/router';
import { BooksService } from '@e-commerce/client-web-app/browse/data-access';
import { InputTextModule } from 'primeng/inputtext';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CheckboxModule } from 'primeng/checkbox';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { DividerModule } from 'primeng/divider';
import { ChipModule } from 'primeng/chip';

@Component({
  selector: 'lib-authors-filter',
  template: `
    @if (
      { authors: authors$ | async, authorsError: authorsError$ | async };
      as vm
    ) {
      @if (vm.authors && !vm.authorsError) {
        <lib-filter-accordion-tab
          header="Authors"
          filterName="authors"
          [selectedItemsCount]="selectedAuthorsControl.value?.length ?? 0"
        >
          <div class="flex flex-column gap-2">
            <input
              placeholder="Search for authors..."
              pInputText
              [(ngModel)]="searchText"
              class="w-full"
            />
            <div class="flex flex-column gap-2">
              @for (author of vm.authors; track author) {
                <p-checkbox
                  [formControl]="selectedAuthorsControl"
                  [label]="author"
                  [value]="author"
                />
              } @empty {
                <div>Not found more authors</div>
              }
            </div>
          </div>
        </lib-filter-accordion-tab>
      } @else if (!vm.authors && !vm.authorsError) {
        <lib-filter-skeleton [numberOfSkeletons]="3" />
      } @else if (!vm.authors && vm.authorsError) {
        <div>{{ vm.authorsError }}</div>
      }
    }
  `,
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    FilterSkeletonComponent,
    FilterAccordionTabComponent,
    AsyncPipe,
    InputTextModule,
    FormsModule,
    CheckboxModule,
    DividerModule,
    ChipModule,
    ReactiveFormsModule,
  ],
})
export class AuthorsFilterComponent implements OnInit {
  private authorsApi = inject(AuthorApiService);
  private booksService = inject(BooksService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);

  searchText = signal<string | null>(null);

  selectedAuthorsControl = new FormControl<string[]>([]);

  page = signal(1);
  size = signal(20);

  authors$ = toObservable(this.searchText).pipe(
    debounce((text) => (text ? timer(250) : of({}))),
    switchMap((text) =>
      this.authorsApi.getAll$({
        size: this.size(),
        page: this.page(),
        nameLike: text ?? '',
      }),
    ),
    map((authors) => authors.map(({ name }) => name)),
  );
  authorsError$ = this.authors$.pipe(
    ignoreElements(),
    catchError((resError: ResponseError) => resError.error.message),
  );

  ngOnInit(): void {
    this.route.queryParams
      .pipe(
        map((queryParams) => queryParams['authors'] as string | undefined),
        map((filter) => filter?.replaceAll('_', ' ').split(',') ?? []),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((authors) => {
        this.selectedAuthorsControl.setValue(authors ?? []);
        this.booksService.setAuthorNames(authors);
      });

    this.selectedAuthorsControl.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((authors) => {
        this.router.navigate([], {
          relativeTo: this.route,
          queryParams: {
            authors:
              authors?.map((name) => name.replaceAll(' ', '_'))?.join(',') ||
              null,
          },
          queryParamsHandling: 'merge',
          replaceUrl: true,
        });
      });
  }
}
