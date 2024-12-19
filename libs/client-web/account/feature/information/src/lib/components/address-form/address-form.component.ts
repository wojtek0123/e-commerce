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
import { AddressStore } from '@e-commerce/client-web/account/data-access';
import { CreateUserAddressBody } from '@e-commerce/client-web/shared/data-access/api-services';
import {
  FormFieldComponent,
  LabelComponent,
} from '@e-commerce/client-web/shared/ui';
import { Country } from '@prisma/client';
import {
  AutoCompleteCompleteEvent,
  AutoCompleteModule,
} from 'primeng/autocomplete';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TooltipModule } from 'primeng/tooltip';
import { combineLatest, map } from 'rxjs';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { isEqual, omit } from 'lodash-es';
import { ErrorMessageDirective } from '@e-commerce/client-web/shared/utils';
import { Message } from 'primeng/message';

@Component({
  selector: 'lib-address-form',
  standalone: true,
  templateUrl: './address-form.component.html',
  imports: [
    ReactiveFormsModule,
    FormFieldComponent,
    AutoCompleteModule,
    ButtonModule,
    InputTextModule,
    TooltipModule,
    LabelComponent,
    ErrorMessageDirective,
    Message,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddressFormComponent {
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

  public countries = this.addressStore.countries;
  public formType = this.addressStore.formType;
  public loading = this.addressStore.loading;
  public updatingAddress = this.addressStore.updatingAddress;
  public isFormVisible = this.addressStore.formVisibility;
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
      const isFormVisible = this.isFormVisible();

      untracked(() => {
        if (!isFormVisible) this.form.reset();
      });
    });

    effect(() => {
      const address = this.updatingAddress();

      untracked(() => {
        this.form.setValue(
          {
            firstName: address?.firstName ?? null,
            lastName: address?.lastName ?? null,
            country: address?.country ?? null,
            street: address?.street ?? null,
            homeNumber: address?.homeNumber ?? null,
            houseNumber: address?.houseNumber ?? null,
            postcode: address?.postcode ?? null,
            phone: address?.phone ?? null,
            city: address?.city ?? null,
          },
          { emitEvent: false },
        );
      });
    });
  }

  public filterCountries(event: AutoCompleteCompleteEvent) {
    this.addressStore.getCountries$({ name: event.query });
  }

  public hideForm() {
    this.addressStore.hideForm();
  }

  public submit() {
    Object.keys(this.form.controls).forEach((control) =>
      this.form.get(control)?.markAsDirty(),
    );

    if (this.form.invalid || !this.isFormChanged()) return;

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
