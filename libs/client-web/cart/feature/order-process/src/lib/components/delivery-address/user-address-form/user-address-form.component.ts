import { NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  untracked,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AddressStore } from '@e-commerce/client-web/cart/data-access';
import { Country } from '@e-commerce/shared/api-models';
import { CreateUserAddressBody } from '@e-commerce/client-web/shared/data-access/api-services';
import {
  ErrorMessageComponent,
  FormFieldComponent,
} from '@e-commerce/client-web/shared/ui';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import {
  AutoCompleteCompleteEvent,
  AutoCompleteModule,
} from 'primeng/autocomplete';
import { TooltipModule } from 'primeng/tooltip';
import { isEqual, omit } from 'lodash-es';
import { combineLatest, map } from 'rxjs';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'lib-user-address-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgClass,
    FormFieldComponent,
    ErrorMessageComponent,
    AutoCompleteModule,
    ButtonModule,
    InputTextModule,
    TooltipModule,
  ],
  templateUrl: './user-address-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserAddressFormComponent {
  private readonly addressStore = inject(AddressStore);

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
  public isFormVisible = this.addressStore.formVisibility;
  public updatingAddress = this.addressStore.updatingAddress;
  public isFormInvalid = toSignal(
    this.form.valueChanges.pipe(map(() => this.form.invalid)),
    { initialValue: false },
  );

  public isFormChanged = toSignal(
    combineLatest([
      this.form.valueChanges,
      toObservable(this.updatingAddress),
    ]).pipe(
      map(
        ([formValues, updatingAddress]) =>
          !isEqual(
            formValues,
            omit(updatingAddress, ['id', 'countryId', 'userId']),
          ),
      ),
    ),
    { initialValue: false },
  );

  public tooltipMessage = computed(() => {
    if (!this.isFormChanged()) {
      return 'No changes detected. Make an update to enable the Save button.';
    }

    if (this.isFormInvalid()) {
      return 'Please review the form to make sure all required fields are filled.';
    }

    return '';
  });

  constructor() {
    effect(() => {
      const address = this.updatingAddress();

      untracked(() => {
        this.form.setValue({
          firstName: address?.firstName ?? null,
          lastName: address?.lastName ?? null,
          country: address?.country ?? null,
          street: address?.street ?? null,
          homeNumber: address?.homeNumber ?? null,
          houseNumber: address?.houseNumber ?? null,
          postcode: address?.postcode ?? null,
          phone: address?.phone ?? null,
          city: address?.city ?? null,
        });
      });
    });

    effect(() => {
      const isFormVisible = this.isFormVisible();

      untracked(() => {
        if (!isFormVisible) return;

        this.form.reset();
      });
    });
  }

  public hideForm() {
    this.addressStore.hideForm();
  }

  public filterCountries(event: AutoCompleteCompleteEvent) {
    this.addressStore.getCountries$({ name: event.query });
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
