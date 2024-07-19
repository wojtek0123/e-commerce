import { AsyncPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Pipe,
  PipeTransform,
  inject,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { filter, firstValueFrom, map, tap } from 'rxjs';
import { ChipModule } from 'primeng/chip';
import { Button, ButtonModule } from 'primeng/button';

@Pipe({
  standalone: true,
  name: 'keyValue',
})
export class KeyValuePipe implements PipeTransform {
  transform(filters: { [key: string]: string }[] | null) {
    console.log(filters);
    if (!filters) return [];
    const x = filters.flatMap((filter) =>
      Object.entries(filter).flatMap(([key, value]) => ({ key, value })),
    );

    return x;
  }
}

@Component({
  selector: 'lib-active-filters',
  template: `
    <div class="flex flex-wrap gap-1">
      @for (keyvalue of activeFilters$ | async | keyValue; track $index) {
        <div class="surface-hover border-round flex align-items-center pl-3">
          <span>{{ keyvalue.key + ': ' + keyvalue.value }}</span>
          <p-button
            icon="pi pi-times"
            size="small"
            [text]="true"
            (click)="onRemove({ key: keyvalue.key, value: keyvalue.value })"
          />
        </div>
      }
    </div>
  `,
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AsyncPipe, ChipModule, KeyValuePipe, ButtonModule],
})
export class ActiveFiltersComponent {
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  activeFilters$ = this.route.queryParams.pipe(
    map((queryParams) =>
      Object.entries(queryParams).flatMap(([key, value]) =>
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

    const x = activeFilters.filter((activeFilter) =>
      Object.entries(activeFilter).every(
        ([key, value]) => key !== filter.key || value !== filter.value,
      ),
    );

    console.log(x);

    const f = this.groupBy(x);

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: f,
    });
  }

  groupBy(array: { [key: string]: string }[]) {
    return array.reduce(
      (result, currentPair) => {
        const key = Object.keys(currentPair)[0];
        const value = currentPair[key];
        if (!result[key]) {
          result[key] = '';
        }
        // result[key].push(value.trim().replaceAll(' ', '_'));
        result[key] =
          result[key].length > 0
            ? result[key] + ',' + value.trim().replaceAll(' ', '_')
            : value.trim().replaceAll(' ', '_');
        return result;
      },
      {} as { [key: string]: string },
    );
  }
}
