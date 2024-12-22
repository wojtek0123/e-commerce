import {
  ChangeDetectionStrategy,
  Component,
  computed,
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
import { CreateUserAddressBody } from '@e-commerce/client-web/shared/data-access/api-services';
import {
  FormFieldComponent,
  LabelComponent,
} from '@e-commerce/client-web/shared/ui';
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
import { CountryStore } from '@e-commerce/client-web/shared/data-access/stores';
import { Country, UserAddress } from '@e-commerce/shared/api-models';

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
  private readonly addressStore = inject(CountryStore);

  public loading = input.required<boolean>();
  public initialAddress = input<UserAddress>();
  public isEditMode = computed(() => !!this.initialAddress());

  onAdd = output<CreateUserAddressBody>();
  onEdit = output<CreateUserAddressBody>();
  onCancel = output<void>();

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

  public isFormInvalid = toSignal(
    this.form.statusChanges.pipe(map((status) => status === 'INVALID')),
    { initialValue: false },
  );
  public isFormChanged = toSignal(
    combineLatest([
      this.form.valueChanges,
      toObservable(this.initialAddress),
    ]).pipe(
      map(
        ([formValues, initialAddress]) =>
          !isEqual(
            formValues,
            omit(initialAddress, ['id', 'countryId', 'userId']),
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
      const address = this.initialAddress();

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

  public cancel() {
    this.onCancel.emit();
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

    if (this.isEditMode()) {
      this.onEdit.emit(formValues);
    } else {
      this.onAdd.emit(formValues);
    }
  }
}

export interface AddressFormSubmitEvent {
  formType: 'add' | 'edit';
  formValues: CreateUserAddressBody;
}