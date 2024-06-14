import {
  Component,
  DestroyRef,
  HostBinding,
  OnInit,
  inject,
  output,
  signal,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputMaskModule } from 'primeng/inputmask';
import { DividerModule } from 'primeng/divider';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { NgClass } from '@angular/common';
import { RouterLink } from '@angular/router';
import {
  Country,
  ResponseError,
  UserAddress,
} from '@e-commerce/client-web-app/shared/data-access/api-types';
import {
  CountryApiService,
  UserAddressApiService,
} from '@e-commerce/client-web-app/shared/data-access/api-services';
import { TooltipModule } from 'primeng/tooltip';
import omit from 'lodash-es/omit';
import isEqual from 'lodash-es/isEqual';
import { take } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SkeletonModule } from 'primeng/skeleton';
import { MessageService } from 'primeng/api';
import { Step } from '@e-commerce/client-web-app/order/data-access';

@Component({
  selector: 'lib-order-details',
  standalone: true,
  imports: [
    InputTextModule,
    ReactiveFormsModule,
    FloatLabelModule,
    InputMaskModule,
    DividerModule,
    DropdownModule,
    FormsModule,
    ButtonModule,
    NgClass,
    RouterLink,
    TooltipModule,
    SkeletonModule,
  ],
  templateUrl: './order-details.component.html',
  styleUrl: './order-details.component.css',
})
export class OrderDetailsComponent implements OnInit {
  private userAddressApi = inject(UserAddressApiService);
  private countryApi = inject(CountryApiService);
  private destroyRef = inject(DestroyRef);
  private messageService = inject(MessageService);

  changeStepEvent = output<Step>();

  @HostBinding('class') class = 'flex flex-column gap-6';

  form = new FormGroup({
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

  countries = signal<Country[]>([]);
  submitted = signal(false);
  loading = signal(false);
  initialLoading = signal(true);
  userAddress = signal<UserAddress | null>(null);

  ngOnInit(): void {
    this.userAddressApi
      .getUserAddress()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (userAddress) => {
          this.initialLoading.set(false);
          this.userAddress.set(userAddress);

          this.form.setValue({
            firstName: userAddress?.firstName ?? null,
            lastName: userAddress?.lastName ?? null,
            city: userAddress?.city ?? null,
            street: userAddress?.street ?? null,
            phone: userAddress?.phone ?? null,
            postcode: userAddress?.postcode ?? null,
            houseNumber: userAddress?.houseNumber ?? null,
            homeNumber: userAddress?.homeNumber ?? null,
            country: userAddress?.country ?? null,
          });
        },
        error: () => {
          this.initialLoading.set(false);
        },
      });

    this.countryApi
      .getCountries()
      .pipe(take(1))
      .subscribe({
        next: (countries) => {
          this.countries.set(countries);
        },
      });
  }

  async submit() {
    this.submitted.set(true);

    if (this.form.invalid) {
      return;
    }

    this.loading.set(true);

    if (!this.userAddress()) {
      const {
        firstName,
        lastName,
        city,
        street,
        homeNumber,
        houseNumber,
        phone,
        country,
        postcode,
      } = this.form.value;
      this.userAddressApi
        .createUserAddress({
          firstName: firstName ?? '',
          lastName: lastName ?? '',
          city: city ?? '',
          street: street ?? '',
          homeNumber: homeNumber ?? '',
          houseNumber: houseNumber ?? '',
          phone: phone ?? '',
          postcode: postcode ?? '',
          countryId: country?.id ?? NaN,
        })
        .subscribe({
          next: async () => {
            this.messageService.add({
              summary: 'Success',
              severity: 'success',
              detail: 'Address has been saved',
            });
            this.loading.set(false);
            this.changeStepEvent.emit('shipping');
          },
          error: (resError: ResponseError) => {
            this.messageService.add({
              summary: 'Error',
              severity: 'error',
              detail:
                resError.error.message ?? 'Error occur while saving address',
            });
            this.loading.set(false);
          },
        });
    }
    const x = omit(this.userAddress(), ['id', 'userId', 'countryId']);
    if (isEqual(this.form.value, x)) {
      this.changeStepEvent.emit('shipping');
      this.loading.set(false);
    } else {
      this.userAddressApi
        .update(this.userAddress()?.id ?? NaN, {
          ...this.form.value,
          countryId: this.form.value.country?.id,
        })
        .pipe(take(1))
        .subscribe({
          next: async () => {
            this.messageService.add({
              summary: 'Success',
              severity: 'success',
              detail: 'Address has been updated',
            });
            this.loading.set(false);
            this.changeStepEvent.emit('shipping');
          },
          error: (resError: ResponseError) => {
            this.messageService.add({
              summary: 'Error',
              severity: 'error',
              detail:
                resError.error.message ?? 'Error occur while updating address',
            });
            this.loading.set(false);
          },
        });
    }
  }
}
