import { DestroyRef, Directive, inject, OnInit } from '@angular/core';
import { BrowseState } from '@e-commerce/client-web/browse/data-access';
import { Store } from '@ngrx/store';
import { FilterComponent } from '../filter/filter.component';
import { debounce, Observable, of, startWith, switchMap, timer } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

export const PAGE = 1 as const;
export const SIZE = 20 as const;

@Directive({})
export abstract class AbstractSelectItemsFilterDirective<T> implements OnInit {
  protected filterComponent = inject(FilterComponent);
  protected store = inject(Store);
  private destroyRef = inject(DestroyRef);

  abstract getItems$: (search: string) => Observable<T[]>;
  abstract selectedItems$: Observable<T[]>;
  abstract trackFn: (_: number, item: T) => number | string;
  abstract getItemLabel: (item: T) => string;
  abstract placeholder: string;
  abstract filterName: keyof BrowseState['filters'];

  ngOnInit(): void {
    this.filterComponent.trackFn = this.trackFn;
    this.filterComponent.getLabelItem = this.getItemLabel;
    this.filterComponent.filterName.set(this.filterName);
    this.filterComponent.placeholder.set(this.placeholder);

    this.selectedItems$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((selectedItems) => {
        this.filterComponent.selectedItems.set(selectedItems);
      });

    this.filterComponent.searchControl.valueChanges
      .pipe(
        startWith(''),
        debounce((search) => (search ? timer(350) : of({}))),
        switchMap((search) => this.getItems$(search ?? '')),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((authors) => {
        this.filterComponent.items.set(authors);
      });
  }
}
