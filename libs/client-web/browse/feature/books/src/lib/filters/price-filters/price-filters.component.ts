import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  OnInit,
  computed,
  effect,
  inject,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InputNumberModule } from 'primeng/inputnumber';
import { DividerModule } from 'primeng/divider';
import { FormFieldComponent } from '@e-commerce/client-web/shared/ui';
import { ActivatedRoute, Router } from '@angular/router';
import { AsyncPipe } from '@angular/common';
import { FilterComponent } from '@e-commerce/client-web/browse/ui';
import { CustomFilterDirective } from '@e-commerce/client-web/browse/utils';
import { Store } from '@ngrx/store';
import {
  browseActions,
  selectPriceFilter,
  selectPriceFilterSelected,
} from '@e-commerce/client-web/browse/data-access';

@Component({
  selector: 'lib-price-filter',
  templateUrl: './price-filters.component.html',
  styleUrl: './price-filters.component.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    InputNumberModule,
    DividerModule,
    FilterComponent,
    FormFieldComponent,
    AsyncPipe,
    FormsModule,
    CustomFilterDirective,
    AsyncPipe,
  ],
})
export class PriceFilterComponent implements OnInit {
  private store = inject(Store);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private destroyRef = inject(DestroyRef);

  selected$ = this.store.select(selectPriceFilterSelected);

  filter = this.store.selectSignal(selectPriceFilter);

  minPrice = signal<number | null>(null);
  maxPrice = signal<number | null>(null);

  choosenPriceLimitsCount = computed(
    () => [this.minPrice(), this.maxPrice()].filter((v) => v).length,
  );

  constructor() {
    effect(
      () => {
        this.minPrice.set(this.filter().min);
        this.maxPrice.set(this.filter().max);
      },
      { allowSignalWrites: true },
    );
  }

  ngOnInit(): void {
    console.log('init');
    // this.route.queryParams
    //   .pipe(
    //     map((queryParams) => ({
    //       min:
    //         Number(queryParams[appRouterConfig.queryParams.minPrice]) || null,
    //       max:
    //         Number(queryParams[appRouterConfig.queryParams.maxPrice]) || null,
    //     })),
    //     filter(
    //       ({ min, max }) =>
    //         !(this.maxPrice() === max && min === this.minPrice()),
    //     ),
    //     takeUntilDestroyed(this.destroyRef),
    //   )
    //   .subscribe(({ min, max }) => {
    //     this.minPrice.set(min);
    //     this.maxPrice.set(max);
    //   });
  }

  onBlur(key: 'min' | 'max') {
    const value = key === 'min' ? this.minPrice() : this.maxPrice();

    this.store.dispatch(
      browseActions.setPrice({
        value,
        key,
      }),
    );
    // this.router.navigate([], {
    //   relativeTo: this.route,
    //   queryParams: {
    //     [appRouterConfig.queryParams[key]]: value || null,
    //   },
    //   queryParamsHandling: 'merge',
    //   replaceUrl: true,
    // });
  }

  clearChecked() {
    // this.router.navigate([], {
    //   relativeTo: this.route,
    //   queryParams: {
    //     [appRouterConfig.queryParams.minPrice]: null,
    //     [appRouterConfig.queryParams.maxPrice]: null,
    //   },
    //   queryParamsHandling: 'merge',
    //   replaceUrl: true,
    // });
  }
}
