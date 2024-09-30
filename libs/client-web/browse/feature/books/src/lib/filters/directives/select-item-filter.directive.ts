import { DestroyRef, Directive, effect, inject, OnInit } from '@angular/core';
import {
  BooksState,
  BooksStore,
} from '@e-commerce/client-web/browse/data-access';
import { FilterComponent } from '../filter/filter.component';
import { debounce, of, timer, Unsubscribable } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Directive({})
export abstract class AbstractSelectItemsFilterDirective<Item>
  implements OnInit
{
  protected filterComponent = inject(FilterComponent);
  protected booksStore = inject(BooksStore);
  private destroyRef = inject(DestroyRef);

  abstract triggerGetItems: (search: string) => Unsubscribable | void;
  abstract items: () => Item[];
  abstract trackFn: (_: number, item: Item) => number | string;
  abstract getItemLabel: (item: Item) => string;
  abstract placeholder: string;
  abstract filterName: keyof BooksState['filters'];
  abstract selectedItems: () => Item[];

  constructor() {
    effect(
      () => {
        this.filterComponent.selectedItems.set(this.selectedItems());
        this.filterComponent.items.set(this.items());
      },
      { allowSignalWrites: true },
    );
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
