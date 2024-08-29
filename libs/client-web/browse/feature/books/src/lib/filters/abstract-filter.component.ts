import { Component, DestroyRef, inject, OnInit, Signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl } from '@angular/forms';
import {
  browseActions,
  Filter,
  BrowseState,
  ActiveFilter,
} from '@e-commerce/client-web/browse/data-access';
import { Store } from '@ngrx/store';
import { debounceTime, Observable } from 'rxjs';

@Component({ template: '' })
export abstract class AbstractFilterComponent<ItemType> implements OnInit {
  protected readonly store = inject(Store);
  private readonly destroyRef = inject(DestroyRef);

  abstract filterName: Signal<keyof BrowseState['filters']>;
  abstract filter$: Observable<Filter<ItemType>>;
  abstract parseName: (item: ItemType) => string;
  abstract parseId: (item: ItemType) => number | string;

  protected searchControl = new FormControl<string | null>(null);

  public ngOnInit(): void {
    this.store.dispatch(
      browseActions.getFilter({ name: '', filter: this.filterName() }),
    );

    this.searchControl.valueChanges
      .pipe(debounceTime(350), takeUntilDestroyed(this.destroyRef))
      .subscribe((search) =>
        this.store.dispatch(
          browseActions.getFilter({ name: search, filter: this.filterName() }),
        ),
      );
  }

  public clearFilterSelectedItems(filter: keyof BrowseState['filters']) {
    this.store.dispatch(browseActions.clearFilterSelectedItems({ filter }));
  }

  public changeSelectedItems(event: {
    selectedItems: ItemType[];
    activeFilter: ActiveFilter;
  }) {
    this.store.dispatch(
      browseActions.setSelectedItems({
        selectedItems: event.selectedItems,
        activeFitler: event.activeFilter,
        filter: this.filterName(),
      }),
    );
  }
}
