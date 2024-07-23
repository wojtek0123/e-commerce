import {
  ChangeDetectionStrategy,
  Component,
  WritableSignal,
  inject,
  signal,
} from '@angular/core';
import { appRouterConfig } from '@e-commerce/client-web-app/shared/utils/router-config';
import { FilterSkeletonComponent } from '../filter-skeleton/filter-skeleton.component';
import { FilterAccordionTabComponent } from '../filter-accordion/filter-accordion.component';
import { AbstractBookFilterComponent } from '@e-commerce/client-web-app/browse/data-access';
import { AsyncPipe } from '@angular/common';
import { CheckboxModule } from 'primeng/checkbox';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { CategoryApiService } from '@e-commerce/client-web-app/shared/data-access/api-services';
import { toObservable } from '@angular/core/rxjs-interop';
import { catchError, ignoreElements, map, shareReplay, switchMap } from 'rxjs';
import { ResponseError } from '@e-commerce/client-web-app/shared/data-access/api-types';

@Component({
  selector: 'lib-categories-filter',
  template: `
    @if ({ categoryNames: names$ | async, error: error$ | async }; as vm) {
      @if (!vm.categoryNames && !vm.error) {
        <lib-filter-skeleton [numberOfSkeletons]="3" />
      } @else if (!vm.categoryNames && vm.error) {
        <div>{{ vm.error }}</div>
      } @else if (vm.categoryNames && !vm.error) {
        <lib-filter-accordion-tab
          filterName="categories"
          header="Categories"
          [selectedItemsCount]="selectedNames().length"
          (clearEvent)="clearChecked()"
        >
          <div class="flex flex-column gap-2">
            <input
              placeholder="Search for categories..."
              pInputText
              [(ngModel)]="searchText"
              class="w-full"
            />
            <div class="flex flex-column gap-2">
              @for (name of vm.categoryNames; track name) {
                <p-checkbox
                  [(ngModel)]="selectedNames"
                  [label]="name"
                  [value]="name"
                  (onChange)="onChange($event)"
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
export class CategoriesFilterComponent extends AbstractBookFilterComponent {
  private categoryApi = inject(CategoryApiService);

  override searchText: WritableSignal<string | null> = signal(null);
  override selectedNames: WritableSignal<string[]> = signal([]);
  override queryParamKey: string = appRouterConfig.queryParams.categories;
  override names$ = toObservable(this.searchText).pipe(
    switchMap((searchText) =>
      this.categoryApi.getCategories$({
        nameLike: searchText ?? '',
        page: 1,
        size: 20,
      }),
    ),
    map((categories) => categories.map(({ name }) => name)),
    shareReplay(1),
  );
  override error$ = this.names$.pipe(
    ignoreElements(),
    catchError((resError: ResponseError) => resError.error.message),
  );
}
