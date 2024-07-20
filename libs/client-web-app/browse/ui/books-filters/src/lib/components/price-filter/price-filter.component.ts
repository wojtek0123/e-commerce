import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  OnInit,
  inject,
  signal,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { InputNumberModule } from 'primeng/inputnumber';
import { DividerModule } from 'primeng/divider';
import { FilterAccordionTabComponent } from '../filter-accordion/filter-accordion.component';
import { FormFieldComponent } from '@e-commerce/client-web-app/shared/ui/form-field';
import { ActivatedRoute, Router } from '@angular/router';
import { distinct, filter, map } from 'rxjs';
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
      <form [formGroup]="priceForm" class="flex align-items-center gap-2">
        <lib-form-field label="Min">
          <p-inputNumber
            slot="input"
            [min]="0"
            [maxFractionDigits]="2"
            formControlName="min"
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
            formControlName="max"
            [maxFractionDigits]="2"
            mode="decimal"
            class="w-full"
            currency="USD"
          />
        </lib-form-field>
      </form>
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
    ReactiveFormsModule,
    FilterAccordionTabComponent,
    FormFieldComponent,
    AsyncPipe,
  ],
})
export class PriceFilterComponent implements OnInit {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private destroyRef = inject(DestroyRef);

  priceForm = new FormGroup({
    min: new FormControl<number | null>(null, {
      validators: [Validators.min(0)],
      updateOn: 'blur',
    }),
    max: new FormControl<number | null>(null, {
      validators: [Validators.min(0)],
      updateOn: 'blur',
    }),
  });

  choosenPriceLimitsCount = signal(0);

  ngOnInit(): void {
    this.route.queryParams
      .pipe(
        map((queryParams) => ({
          min:
            Number(queryParams[appRouterConfig.queryParams.minPrice]) || null,
          max:
            Number(queryParams[appRouterConfig.queryParams.maxPrice]) || null,
        })),
        filter(({ min, max }) => {
          const { min: formMin, max: formMax } = this.priceForm.value;

          return !(formMax === max && min === formMin);
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(({ min, max }) => {
        this._setFilterCount(min, max);

        this.priceForm.setValue({
          min,
          max,
        });
      });

    this.priceForm.valueChanges
      .pipe(
        distinct(({ min, max }) => min && max),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(({ min, max }) => {
        this._setFilterCount(min, max);

        this.router.navigate([], {
          relativeTo: this.route,
          queryParams: {
            [appRouterConfig.queryParams.minPrice]: min ?? null,
            [appRouterConfig.queryParams.maxPrice]: max ?? null,
          },
          queryParamsHandling: 'merge',
          replaceUrl: true,
        });
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

  private _setFilterCount(min?: number | null, max?: number | null) {
    this.choosenPriceLimitsCount.set(
      [min, max].filter((value) => value).length,
    );
  }
}
