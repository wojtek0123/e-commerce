import { NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  model,
  OnInit,
  signal,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  orderProcessActions,
  orderProcessSelectors,
} from '@e-commerce/client-web/cart/data-access';
import { Country } from '@e-commerce/client-web/shared/data-access';
import {
  ErrorMessageComponent,
  FormFieldComponent,
} from '@e-commerce/client-web/shared/ui';
import { Store } from '@ngrx/store';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'lib-user-address-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgClass,
    FormFieldComponent,
    ErrorMessageComponent,
    DropdownModule,
    ButtonModule,
    InputTextModule,
  ],
  templateUrl: './user-address-form.component.html',
  styleUrl: './user-address-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserAddressFormComponent implements OnInit {
  private readonly store = inject(Store);

  public formType = model<'add' | 'update' | null>();

  protected form = new FormGroup({
    firstName: new FormControl<string | null>(null, Validators.required),
    lastName: new FormControl<string | null>(null, Validators.required),
    city: new FormControl<string | null>(null, Validators.required),
    street: new FormControl<string | null>(null, Validators.required),
    houseNumber: new FormControl<string | null>(null),
    homeNumber: new FormControl<string | null>(null, Validators.required),
    postcode: new FormControl<string | null>(null, Validators.required),
    phone: new FormControl<string | null>(null, Validators.required),
    country: new FormControl<Country | null>(null, Validators.required),
  });

  public loading = this.store.selectSignal(
    orderProcessSelectors.selectUserAddressLoading,
  );
  public userAddress = this.store.selectSignal(
    orderProcessSelectors.selectUserAddressData,
  );
  public error = this.store.selectSignal(
    orderProcessSelectors.selectUserAddressError,
  );
  public submitted = signal(false);

  public countries = this.store.selectSignal(
    orderProcessSelectors.selectCountriesData,
  );

  constructor() {
    effect(
      () => {
        if (this.formType() === 'update' && this.userAddress()) {
          const {
            firstName,
            lastName,
            country,
            city,
            street,
            houseNumber,
            homeNumber,
            postcode,
            phone,
          } = this.userAddress()!;

          this.form.setValue({
            firstName,
            lastName,
            country,
            street,
            homeNumber,
            houseNumber: houseNumber ?? null,
            postcode,
            phone,
            city,
          });
        }
      },
      { allowSignalWrites: true },
    );
  }

  ngOnInit(): void {
    this.store.dispatch(orderProcessActions.getCountries());
  }

  public submit() {
    this.submitted.set(true);

    if (this.form.invalid) {
      return;
    }

    const {
      firstName,
      lastName,
      city,
      street,
      homeNumber,
      houseNumber,
      postcode,
      phone,
      country,
    } = this.form.value;

    if (this.formType() === 'update') {
      this.store.dispatch(
        orderProcessActions.updateUserAddress({
          id: this.userAddress()!.id,
          data: {
            firstName: firstName!,
            lastName: lastName!,
            city: city!,
            street: street!,
            homeNumber: homeNumber!,
            postcode: postcode!,
            phone: phone!,
            country: country!,
            countryId: country!.id,
            ...(houseNumber && { houseNumber: houseNumber! }),
          },
        }),
      );
      this.formType.set(null);
    } else {
      this.store.dispatch(
        orderProcessActions.addUserAddress({
          data: {
            firstName: firstName!,
            lastName: lastName!,
            city: city!,
            street: street!,
            homeNumber: homeNumber!,
            postcode: postcode!,
            phone: phone!,
            countryId: country!.id,
            ...(houseNumber && { houseNumber: houseNumber! }),
          },
        }),
      );
    }
  }
}
