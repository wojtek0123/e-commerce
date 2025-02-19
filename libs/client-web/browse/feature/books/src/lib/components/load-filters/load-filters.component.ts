import { KeyValuePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Pipe,
  PipeTransform,
  signal,
} from '@angular/core';
import {
  ActiveFilter,
  BooksQueryParam,
  BooksStore,
  FILTER_PAGE,
  FILTER_SIZE,
} from '@e-commerce/client-web/browse/data-access';
import { DisplayActiveFiltersComponent } from '@e-commerce/client-web/browse/ui';
import { AccordionModule } from 'primeng/accordion';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import {
  AccordionComponent,
  AccordionPanelComponent,
  AccordionPanelKey,
} from '@e-commerce/client-web/shared/ui';
import { BadgeModule } from 'primeng/badge';
import { MessageService } from 'primeng/api';
import { Message } from 'primeng/message';

@Pipe({
  name: 'getFiltersCount',
  standalone: true,
})
export class GetFiltersCount implements PipeTransform {
  transform(filter: any) {
    return [...filter.values()].reduce((acc, f) => acc + f.length, 0);
  }
}

@Component({
  selector: 'lib-load-filters',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './load-filters.component.html',
  imports: [
    ButtonModule,
    DialogModule,
    AccordionModule,
    KeyValuePipe,
    DisplayActiveFiltersComponent,
    AccordionModule,
    AccordionComponent,
    AccordionPanelComponent,
    BadgeModule,
    GetFiltersCount,
    Message,
  ],
})
export class LoadFiltersComponent {
  #booksStore = inject(BooksStore);
  #meesageService = inject(MessageService);

  filters = signal<Map<string, Map<string, ActiveFilter[]>> | null>(null);
  visible = signal(false);

  initialAccordionState = signal<AccordionPanelKey[]>([]);

  open() {
    const rawFilters = new Map<string, ActiveFilter[]>(
      JSON.parse(localStorage.getItem('filters') || '[]'),
    );

    const filters = new Map<string, Map<string, ActiveFilter[]>>();
    for (const [outerKey, activeFilters] of rawFilters) {
      if (!filters.has(outerKey)) {
        filters.set(outerKey, new Map());
      }

      const groupedActiveFilters = this.groupBy(
        activeFilters,
        (activeFilter: ActiveFilter) => activeFilter.filter,
      );

      [...groupedActiveFilters].forEach(([key, value]) => {
        filters.get(outerKey)?.set(key, value);
      });
    }

    this.filters.set(filters);
    this.visible.set(true);
    this.initialAccordionState.set([]);
  }

  cancel() {
    this.visible.set(false);
  }

  load(filters: Map<string, ActiveFilter[]>) {
    const queryParams: BooksQueryParam = {
      categories: this.parseActiveFilterToQueryParam(filters.get('category')),
      tags: this.parseActiveFilterToQueryParam(filters.get('tag')),
      authors: this.parseActiveFilterToQueryParam(filters.get('author')),
      minPrice: Number(filters.get('minPrice')) || null,
      maxPrice: Number(filters.get('maxPrice')) || null,
      size: FILTER_SIZE,
      search: null,
      page: FILTER_PAGE,
      sortBy: 'title',
      sortByMode: 'asc',
    };

    this.visible.set(false);
    this.#booksStore.loadFilters(queryParams);
  }

  remove(filter: string, event: Event) {
    event.stopImmediatePropagation();

    const rawFilters = new Map<string, ActiveFilter[]>(
      JSON.parse(localStorage.getItem('filters') || '[]'),
    );

    rawFilters.delete(filter);

    localStorage.setItem('filters', JSON.stringify([...rawFilters]));

    const filters = new Map<string, Map<string, ActiveFilter[]>>();
    for (const [outerKey, activeFilters] of rawFilters) {
      if (!filters.has(outerKey)) {
        filters.set(outerKey, new Map());
      }

      const groupedActiveFilters = this.groupBy(
        activeFilters,
        (activeFilter: ActiveFilter) => activeFilter.filter,
      );

      [...groupedActiveFilters].forEach(([key, value]) => {
        filters.get(outerKey)?.set(key, value);
      });
    }

    this.filters.set(filters);

    this.#meesageService.add({
      summary: 'Info',
      detail: 'Filters has been removed',
      severity: 'info',
    });
  }

  parseActiveFilterToQueryParam(activeFilters?: ActiveFilter[]) {
    return (
      activeFilters
        ?.map((filter) =>
          filter.value.toString().replace(' ', '_').toLowerCase(),
        )
        .join(',') ?? null
    );
  }

  groupBy<T, Q>(
    array: T[],
    predicate: (value: T, index: number, array: T[]) => Q,
  ) {
    return array.reduce((map, value, index, array) => {
      const key = predicate(value, index, array);
      map.get(key)?.push(value) ?? map.set(key, [value]);
      return map;
    }, new Map<Q, T[]>());
  }
}
