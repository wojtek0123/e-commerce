import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  OnInit,
  inject,
  output,
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
import {
  BooksFilters,
  BooksService,
} from '@e-commerce/client-web-app/browse/data-access';
import { filter, map, tap } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'lib-price-filter',
  template: `
    <lib-filter-accordion-tab
      header="Price"
      [type]="'custom'"
      (clearEvent)="clearFilterEvent.emit($event)"
      filterName="price"
      [selectedItems]="(nonNullControls$ | async) ?? []"
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
  private booksService = inject(BooksService);

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

  nonNullControls$ = this.route.queryParams.pipe(
    map((queryParams) => {
      const price = queryParams['price'];
      const min = price?.startsWith('from_') ? +price.split('_')[1] : null;
      const max = price?.includes('to_') ? +price.split('to_')[1] : null;
      return [min, max].filter((v) => v);
    }),
  );
  clearFilterEvent = output<keyof BooksFilters>();

  initial = signal(true);

  ngOnInit(): void {
    this.route.queryParams
      .pipe(
        map((queryParams) => queryParams['price']),
        tap((price) => console.log(price)),
        filter((price) => this.initial() || !price),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((price) => {
        const min = price?.startsWith('from_') ? +price.split('_')[1] : null;
        const max = price?.includes('to_') ? +price.split('to_')[1] : null;
        this.initial.set(false);
        this.booksService.setMaxPrice(max ?? null);
        this.booksService.setMinPrice(min ?? null);
        this.priceForm.setValue({ min, max });
      });

    this.priceForm.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(({ min, max }) => {
        this.booksService.setMaxPrice(max ?? null);
        this.booksService.setMinPrice(min ?? null);
        this.router.navigate([], {
          relativeTo: this.route,
          queryParams: {
            price:
              !min && !max
                ? null
                : `${min ? 'from_' + min : ''}${min && max ? '_' : ''}${max ? 'to_' + max : ''}`,
          },
          queryParamsHandling: 'merge',
          replaceUrl: true,
        });
      });
  }
}
