import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InputNumberModule } from 'primeng/inputnumber';
import { DividerModule } from 'primeng/divider';
import { FormFieldComponent } from '@e-commerce/client-web/shared/ui';
import { AsyncPipe } from '@angular/common';
import { CustomFilterDirective } from '@e-commerce/client-web/browse/utils';
import { Store } from '@ngrx/store';
import {
  browseActions,
  selectPriceFilter,
  selectSelectedPrices,
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
    FormFieldComponent,
    AsyncPipe,
    FormsModule,
    CustomFilterDirective,
    AsyncPipe,
  ],
})
export class PriceFilterComponent {
  private store = inject(Store);

  selected$ = this.store.select(selectSelectedPrices);

  filter = this.store.selectSignal(selectPriceFilter);

  minPrice = computed(() => signal(this.filter().min));
  maxPrice = computed(() => signal(this.filter().max));

  choosenPriceLimitsCount = computed(
    () => [this.minPrice(), this.maxPrice()].filter((v) => v).length,
  );

  onBlur(key: 'min' | 'max') {
    const value = key === 'min' ? this.minPrice() : this.maxPrice();

    this.store.dispatch(
      browseActions.setPrice({
        value: value(),
        key,
      }),
    );
  }
}
