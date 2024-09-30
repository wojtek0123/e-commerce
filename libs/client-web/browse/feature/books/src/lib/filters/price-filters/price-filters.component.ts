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
import { AsyncPipe } from '@angular/common';
import { CustomFilterDirective } from '@e-commerce/client-web/browse/utils';
import { BooksStore } from '@e-commerce/client-web/browse/data-access';

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
    ReactiveFormsModule,
  ],
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

  public setPrice(key: 'min' | 'max') {
    const value =
      key === 'min' ? this.minPriceInput().value : this.maxPriceInput().value;

    this.booksStore.setPrice(value ? Number(value) : null, key);
  }
}
