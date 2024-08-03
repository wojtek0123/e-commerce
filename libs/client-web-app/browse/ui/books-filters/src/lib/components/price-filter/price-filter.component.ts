import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  OnInit,
  computed,
  inject,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InputNumberModule } from 'primeng/inputnumber';
import { DividerModule } from 'primeng/divider';
import { FilterAccordionTabComponent } from '../filter-accordion/filter-accordion.component';
import { FormFieldComponent } from '@e-commerce/client-web-app/shared/ui/form-field';
import { ActivatedRoute, Router } from '@angular/router';
import { filter, map } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { appRouterConfig } from '@e-commerce/client-web-app/shared/utils/router-config';

@Component({
  selector: 'lib-price-filter',
  template: `
    <lib-filter-accordion-tab
      header="Price"
      (clearEvent)="clearChecked()"
      filterName="price"
      [selectedItemsCount]="choosenPriceLimitsCount()"
    >
      <div class="flex align-items-center gap-2">
        <lib-form-field label="Min">
          <p-inputNumber
            slot="input"
            [min]="0"
            [maxFractionDigits]="2"
            [(ngModel)]="minPrice"
            (onBlur)="onBlur(minPrice(), 'minPrice')"
            mode="decimal"
            class="w-full"
            currency="USD"
          />
        </lib-form-field>
        <p-divider styleClass="w-1rem mt-3" />
        <lib-form-field label="Max">
          <p-inputNumber
            slot="input"
            [min]="0"
            [(ngModel)]="maxPrice"
            (onBlur)="onBlur(maxPrice(), 'maxPrice')"
            [maxFractionDigits]="2"
            mode="decimal"
            class="w-full"
            currency="USD"
          />
        </lib-form-field>
      </div>
    </lib-filter-accordion-tab>
  `,
  styles: [
    `
      :host ::ng-deep {
        .p-inputtext {
          width: 100%;
        }
      }
    `,
  ],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    InputNumberModule,
    DividerModule,
    FilterAccordionTabComponent,
    FormFieldComponent,
    AsyncPipe,
    FormsModule,
  ],
})
export class PriceFilterComponent implements OnInit {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private destroyRef = inject(DestroyRef);

  minPrice = signal<number | null>(null);
  maxPrice = signal<number | null>(null);

  choosenPriceLimitsCount = computed(
    () => [this.minPrice(), this.maxPrice()].filter((v) => v).length,
  );

  ngOnInit(): void {
    this.route.queryParams
      .pipe(
        map((queryParams) => ({
          min:
            Number(queryParams[appRouterConfig.queryParams.minPrice]) || null,
          max:
            Number(queryParams[appRouterConfig.queryParams.maxPrice]) || null,
        })),
        filter(
          ({ min, max }) =>
            !(this.maxPrice() === max && min === this.minPrice()),
        ),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(({ min, max }) => {
        this.minPrice.set(min);
        this.maxPrice.set(max);
      });
  }

  onBlur(value: number | null, key: 'minPrice' | 'maxPrice') {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        [appRouterConfig.queryParams[key]]: value || null,
      },
      queryParamsHandling: 'merge',
      replaceUrl: true,
    });
  }

  clearChecked() {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        [appRouterConfig.queryParams.minPrice]: null,
        [appRouterConfig.queryParams.maxPrice]: null,
      },
      queryParamsHandling: 'merge',
      replaceUrl: true,
    });
  }
}
