import {
  ChangeDetectionStrategy,
  Component,
  WritableSignal,
  inject,
  signal,
} from '@angular/core';
import { AuthorApiService } from '@e-commerce/client-web-app/shared/data-access/api-services';
import { FilterSkeletonComponent } from '../filter-skeleton/filter-skeleton.component';
import { FilterAccordionTabComponent } from '../filter-accordion/filter-accordion.component';
import { AsyncPipe } from '@angular/common';
import {
  Observable,
  catchError,
  debounce,
  ignoreElements,
  map,
  of,
  shareReplay,
  switchMap,
  timer,
} from 'rxjs';
import { ResponseError } from '@e-commerce/client-web-app/shared/data-access/api-types';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { CheckboxModule } from 'primeng/checkbox';
import { DividerModule } from 'primeng/divider';
import { ChipModule } from 'primeng/chip';
import { appRouterConfig } from '@e-commerce/client-web-app/shared/utils/router-config';
import { AbstractBookFilterComponent } from '@e-commerce/client-web-app/browse/data-access';
import { toObservable } from '@angular/core/rxjs-interop';

@Component({
  selector: 'lib-authors-filter',
  template: `
    @if ({ authorNames: names$ | async, error: error$ | async }; as vm) {
      @if (vm.authorNames && !vm.error) {
        <lib-filter-accordion-tab
          header="Authors"
          filterName="authors"
          [selectedItemsCount]="selectedNames.length"
          (clearEvent)="clearChecked()"
        >
          <div class="flex flex-column gap-2">
            <input
              placeholder="Search for authors..."
              pInputText
              [(ngModel)]="searchText"
              class="w-full"
            />
            <div class="flex flex-column gap-2">
              @for (author of vm.authorNames; track author) {
                <p-checkbox
                  [(ngModel)]="selectedNames"
                  [label]="author"
                  [value]="author"
                  (onChange)="onChange($event)"
                />
              } @empty {
                <div>Not found more authors</div>
              }
            </div>
          </div>
        </lib-filter-accordion-tab>
      } @else if (!vm.authorNames && !vm.error) {
        <lib-filter-skeleton [numberOfSkeletons]="3" />
      } @else if (!vm.authorNames && vm.error) {
        <div>{{ vm.error }}</div>
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
  ],
})
export class AuthorsFilterComponent extends AbstractBookFilterComponent {
  private authorsApi = inject(AuthorApiService);

  override searchText: WritableSignal<string | null> = signal(null);
  override selectedNames: WritableSignal<string[]> = signal([]);
  override queryParamKey: string = appRouterConfig.queryParams.authors;
  override names$: Observable<string[]> = toObservable(this.searchText).pipe(
    debounce((text) => (text ? timer(350) : of({}))),
    switchMap((text) =>
      this.authorsApi.getAll$({
        size: 20,
        page: this.page(),
        nameLike: text ?? '',
      }),
    ),
    map((authors) => authors.map(({ name }) => name)),
    shareReplay(1),
  );
  override error$: Observable<string | null> = this.names$.pipe(
    ignoreElements(),
    catchError((resError: ResponseError) => resError.error.message),
  );

  page = signal(1);
}
