import { Component, DestroyRef, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CheckboxChangeEvent } from 'primeng/checkbox';
import {
  buildQueryParam,
  parseQueryParamToSelectedItemsOperator,
} from '@e-commerce/client-web-app/browse/utils';
import { isEqual } from 'lodash-es';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Observable, filter } from 'rxjs';

@Component({ template: '' })
export abstract class AbstractBookFilterComponent implements OnInit {
  protected route = inject(ActivatedRoute);
  protected router = inject(Router);
  protected destroyRef = inject(DestroyRef);

  searchText = signal<string | null>(null);
  abstract names$: Observable<string[]>;
  abstract error$: Observable<string | null>;
  selectedNames = signal<string[]>([]);
  abstract queryParamKey: string;

  ngOnInit(): void {
    this.route.queryParams
      .pipe(
        parseQueryParamToSelectedItemsOperator(this.queryParamKey),
        filter((items) => !isEqual(items, this.selectedNames)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((items) => {
        this.selectedNames.set(items);
      });
  }

  onChange({ checked }: CheckboxChangeEvent) {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: buildQueryParam(checked, this.queryParamKey),
      queryParamsHandling: 'merge',
      replaceUrl: true,
    });
  }

  clearChecked() {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        [this.queryParamKey]: null,
      },
      queryParamsHandling: 'merge',
      replaceUrl: true,
    });
  }
}
