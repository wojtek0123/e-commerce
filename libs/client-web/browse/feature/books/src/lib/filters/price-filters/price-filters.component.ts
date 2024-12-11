import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  viewChild,
} from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InputNumberModule } from 'primeng/inputnumber';
import { DividerModule } from 'primeng/divider';
import { FormFieldComponent } from '@e-commerce/client-web/shared/ui';
import {
  BooksStore,
  SingleValueFilters,
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
    FormsModule,
    ReactiveFormsModule,
  ],
  host: {
    class: 'max-w-[20rem] w-full',
  },
})
export class PriceFilterComponent {
  private readonly booksStore = inject(BooksStore);

  public enteredPrices = this.booksStore.enteredPrices;

  public minPrice = this.booksStore.minPrice;
  public maxPrice = this.booksStore.maxPrice;

  public choosenPriceLimitsCount = computed(
    () => [this.minPrice(), this.maxPrice()].filter((v) => v).length,
  );

  private minPriceInput = viewChild.required<HTMLInputElement>('minPriceInput');
  private maxPriceInput = viewChild.required<HTMLInputElement>('maxPriceInput');

  public setPrice(
    filter: Extract<SingleValueFilters, 'minPrice' | 'maxPrice'>,
  ) {
    const value =
      filter === 'minPrice'
        ? this.minPriceInput().value
        : this.maxPriceInput().value;

    this.booksStore.setSingleValueFilter(value, filter);
  }
}
