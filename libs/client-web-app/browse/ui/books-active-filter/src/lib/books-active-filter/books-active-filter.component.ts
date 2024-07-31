import { AsyncPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Pipe,
  PipeTransform,
  inject,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { firstValueFrom, map } from 'rxjs';
import { ChipModule } from 'primeng/chip';
import { ButtonModule } from 'primeng/button';

@Pipe({
  standalone: true,
  name: 'keyValue',
})
export class KeyValuePipe implements PipeTransform {
  transform(filters: { [key: string]: string }[] | null) {
    if (!filters) return [];

    return filters.flatMap((filter) =>
      Object.entries(filter).flatMap(([key, value]) => ({
        label: key.replaceAll('_', ' '),
        key,
        value,
      })),
    );
  }
}

@Component({
  selector: 'lib-books-active-filters',
  template: `
    <div class="flex gap-1 overflow-x-auto scroller pb-1 max-width">
      <p-button
        size="small"
        class="min-w-max"
        label="Clear filters"
        severity="secondary"
        (click)="clearFilters()"
      />
      @for (keyvalue of activeFilters$ | async | keyValue; track $index) {
        <div
          class="surface-hover border-round flex align-items-center pl-3 min-w-max"
        >
          <span>{{ keyvalue.label + ': ' + keyvalue.value }}</span>
          <p-button
            icon="pi pi-times"
            size="small"
            [text]="true"
            (click)="
              onRemove({
                key: keyvalue.key,
                value: keyvalue.value,
              })
            "
          />
        </div>
      }
    </div>
  `,
  styles: [
    `
      .scroller {
        scrollbar-width: thin;
        scrollbar-color: var(--text-color-secondary) var(--surface-hover);
      }

      .max-width {
        max-width: calc(100vw - 24rem - 5rem);
      }
    `,
  ],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AsyncPipe, ChipModule, KeyValuePipe, ButtonModule],
})
export class BooksActiveFiltersComponent {
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  activeFilters$ = this.route.queryParams.pipe(
    map((queryParams) =>
      Object.entries(queryParams)
        .filter(([key]) => !['page', 'size'].includes(key))
        .flatMap(([key, value]) =>
          (value as string)
            ?.replaceAll('_', ' ')
            .split(',')
            .map((value) => ({ [key]: value })),
        ),
    ),
  );

  async onRemove(filter: { key: string; value: string }) {
    const activeFilters = (await firstValueFrom(this.activeFilters$)) as {
      [key: string]: string;
    }[];

    const filterOutActiveFilters = activeFilters.filter((activeFilter) =>
      Object.entries(activeFilter).every(
        ([key, value]) => key !== filter.key || value !== filter.value,
      ),
    );

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: this.groupByActiveFiltersByKey(filterOutActiveFilters),
    });
  }

  groupByActiveFiltersByKey(activeFilters: { [key: string]: string }[]) {
    return activeFilters.reduce(
      (result, currentPair) => {
        const key = Object.keys(currentPair)[0];
        const value = currentPair[key];

        if (!result[key]) {
          result[key] = '';
        }

        result[key] =
          result[key].length > 0
            ? result[key] + ',' + value.trim().replaceAll(' ', '_')
            : value.trim().replaceAll(' ', '_');

        return result;
      },
      {} as { [key: string]: string },
    );
  }

  clearFilters() {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: null,
      replaceUrl: true,
    });
  }
}
