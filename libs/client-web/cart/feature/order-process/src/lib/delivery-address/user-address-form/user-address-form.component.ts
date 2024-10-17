import { NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  input,
  output,
  untracked,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AddressStore } from '@e-commerce/client-web/cart/data-access';
import {
  Country,
  CreateUserAddressBody,
  UserAddress,
} from '@e-commerce/client-web/shared/data-access';
import {
  ErrorMessageComponent,
  FormFieldComponent,
} from '@e-commerce/client-web/shared/ui';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';

@Component({
  selector: 'lib-user-address-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgClass,
    FormFieldComponent,
    ErrorMessageComponent,
    SelectModule,
    ButtonModule,
    InputTextModule,
  ],
  templateUrl: './user-address-form.component.html',
  styleUrl: './user-address-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserAddressFormComponent {
  private readonly addressStore = inject(AddressStore);

  public updatingUserAddress = input<UserAddress | null>();

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

  public loading = this.addressStore.loading;
  public countries = this.addressStore.countries;

  public formType = this.addressStore.formType;
  public updatingAddress = this.addressStore.updatingAddress;

  constructor() {
    effect(() => {
      const userAddress = this.updatingUserAddress();

      untracked(() => {
        this.form.setValue(
          {
            firstName: userAddress?.firstName ?? null,
            lastName: userAddress?.lastName ?? null,
            country: userAddress?.country ?? null,
            street: userAddress?.street ?? null,
            homeNumber: userAddress?.homeNumber ?? null,
            houseNumber: userAddress?.houseNumber ?? null,
            postcode: userAddress?.postcode ?? null,
            phone: userAddress?.phone ?? null,
            city: userAddress?.city ?? null,
          },
          { emitEvent: false },
        );
      });
    });
  }

  public getCountries() {
    this.addressStore.getCountries({ name: '' });
  }

  public hideForm() {
    this.addressStore.hideForm();
  }

  public submit() {
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

    const formValues: CreateUserAddressBody = {
      firstName: firstName ?? '',
      lastName: lastName ?? '',
      city: city ?? '',
      street: street ?? '',
      homeNumber: homeNumber ?? '',
      houseNumber: houseNumber ?? '',
      postcode: postcode ?? '',
      phone: phone ?? '',
      countryId: country?.id ?? '',
    };

    if (this.formType() === 'add') {
      this.addressStore.addAddress$({ data: formValues });
    } else if (this.formType() === 'update') {
      this.addressStore.updateAddress$({ data: formValues });
    }
  }
}
