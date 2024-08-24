import { NgClass } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
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
import {
  selectUserAddress,
  selectUserAddressError,
  selectUserAddressLoading,
} from 'libs/client-web/cart/data-access/src/lib/store/order-process/order-process.selectors';
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
})
export class UserAddressFormComponent implements OnInit {
  private readonly store = inject(Store);

  protected form = new FormGroup({
    firstName: new FormControl('', Validators.required),
    lastName: new FormControl<string>('', Validators.required),
    city: new FormControl<string>('', Validators.required),
    street: new FormControl<string>('', Validators.required),
    houseNumber: new FormControl<string>(''),
    homeNumber: new FormControl<string>('', Validators.required),
    postcode: new FormControl<string>('', Validators.required),
    phone: new FormControl('', Validators.required),
    country: new FormControl<Country | null>(null, Validators.required),
  });

  public loading = this.store.selectSignal(selectUserAddressLoading);
  public userAddress = this.store.selectSignal(selectUserAddress);
  public error = this.store.selectSignal(selectUserAddressError);
  public submitted = signal(false);

  public countries = this.store.selectSignal(
    orderProcessSelectors.selectCountriesData,
  );

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
