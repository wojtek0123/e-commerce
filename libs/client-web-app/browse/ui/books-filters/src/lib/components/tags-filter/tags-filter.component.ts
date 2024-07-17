import {
  ChangeDetectionStrategy,
  Component,
  inject,
  output,
  signal,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  BooksFilters,
  BooksService,
} from '@e-commerce/client-web-app/browse/data-access';
import {
  BookTag,
  allBookTags,
} from '@e-commerce/client-web-app/shared/data-access/api-types';
import { appRouterConfig } from '@e-commerce/client-web-app/shared/utils/router-config';
import { map, tap } from 'rxjs';
import { FilterAccordionTabComponent } from '../filter-accordion/filter-accordion.component';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'lib-tags-filter',
  template: `
    <lib-filter-accordion-tab
      filterName="tags"
      header="Tagi"
      [items]="tags()"
      [selectedItems]="(selectedTags$ | async) ?? []"
      (clearEvent)="clearFilterEvent.emit($event)"
      (changeEvent)="updateSelectedTags($event)"
    />
  `,
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FilterAccordionTabComponent, AsyncPipe],
})
export class TagsFilterComponent {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private booksService = inject(BooksService);

  selectedTags$ = this.route.queryParams.pipe(
    map(
      (queryParams) =>
        queryParams[appRouterConfig.browse.tagsQueryParams] as
          | string
          | undefined,
    ),
    map((tags) => tags?.split(',') ?? []),
    tap((tags) => this.booksService.setTags(tags as BookTag[])),
  );

  tags = signal<BookTag[]>([...allBookTags]);

  clearFilterEvent = output<keyof BooksFilters>();

  updateSelectedTags(tags: string[]) {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        [appRouterConfig.browse.tagsQueryParams]: tags?.join(',') || null,
      },
      queryParamsHandling: 'merge',
      replaceUrl: true,
    });
  }
}
