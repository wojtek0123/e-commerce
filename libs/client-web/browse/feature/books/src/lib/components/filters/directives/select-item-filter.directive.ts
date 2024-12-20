import {
  DestroyRef,
  Directive,
  effect,
  inject,
  OnInit,
  untracked,
} from '@angular/core';
import {
  BooksStore,
  MultiSelectFilters,
} from '@e-commerce/client-web/browse/data-access';
import { FilterComponent } from '../filter/filter.component';
import { debounce, of, timer, Unsubscribable } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Directive({})
export abstract class AbstractSelectItemsFilterDirective<
  Item extends { id: string; name: string },
> implements OnInit
{
  protected filterComponent = inject(FilterComponent);
  protected booksStore = inject(BooksStore);
  private destroyRef = inject(DestroyRef);

  abstract triggerGetItems: (search: string) => Unsubscribable | void;
  abstract items: () => Item[];
  abstract trackFn: (_: number, item: Item) => number | string;
  abstract getItemLabel: (item: Item) => string;
  abstract placeholder: string;
  abstract filterName: MultiSelectFilters;
  abstract selectedItems: () => Item[];

  constructor() {
    effect(() => {
      const selectedItems = this.selectedItems();
      const items = this.items();

      untracked(() => {
        this.filterComponent.selectedItems.set(selectedItems);
        this.filterComponent.items.set(items);
      });
    });
  }

  ngOnInit(): void {
    this.filterComponent.searchControl.valueChanges
      .pipe(
        debounce((search) => (search ? timer(350) : of({}))),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((search) => {
        this.triggerGetItems(search ?? '');
      });
  }
}
