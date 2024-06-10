import { Component, HostBinding, OnInit, inject, signal } from '@angular/core';
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
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import {
  Country,
  UserAddress,
} from '@e-commerce/client-web-app/shared/data-access/api-types';
import {
  CountryApiService,
  UserAddressApiService,
} from '@e-commerce/client-web-app/shared/data-access/api-services';
import { TooltipModule } from 'primeng/tooltip';
import omit from 'lodash-es/omit';
import reduce from 'lodash-es/reduce';
import isEqual from 'lodash-es/isEqual';
import { take } from 'rxjs';

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
  ],
  templateUrl: './order-details.component.html',
  styleUrl: './order-details.component.css',
})
export class OrderDetailsComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private userAddressApi = inject(UserAddressApiService);
  private countryApi = inject(CountryApiService);

  @HostBinding('class') class = 'flex flex-column gap-6';

  form = new FormGroup({
    firstName: new FormControl('', {
      validators: [Validators.required],
    }),
    lastName: new FormControl<string>('', {
      validators: [Validators.required],
    }),
    city: new FormControl<string>('', {
      validators: [Validators.required],
    }),
    street: new FormControl<string>('', {
      validators: [Validators.required],
    }),
    houseNumber: new FormControl<string>(''),
    homeNumber: new FormControl<string>('', {
      validators: [Validators.required],
    }),
    postcode: new FormControl<string>('', {
      validators: [Validators.required],
    }),
    phone: new FormControl('', {
      validators: [Validators.required],
    }),
    country: new FormControl<Country | null>(null, {
      validators: [Validators.required],
    }),
  });

  countries = signal<Country[]>([]);
  submitted = signal(false);
  loading = signal(false);
  userAddress = signal<UserAddress | null>(null);

  ngOnInit(): void {
    const userAddress: UserAddress | null =
      this.route.snapshot.data['userAddress'] ?? null;

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

    // jeśli użtkownik nie ma stworzonego profilu z danymi adresowymi to je stwórz
    // jeśli użtkownik ma i nic nie zminiał to nic nie rób
    // jeśli ma i je zmienił to zaktualizuj
    // if (Object.entries(this.form.value).some((v) => !v)) return;

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
            await this.router.navigate(['/order/shipping']);
          },
        });
    }
    const x = omit(this.userAddress(), ['id', 'userId', 'countryId']);
    if (isEqual(this.form.value, x)) {
      await this.router.navigate(['/order/shipping']);
    } else {
      this.userAddressApi
        .update(this.userAddress()?.id ?? NaN, { ...this.form.value })
        .pipe(take(1))
        .subscribe({
          next: async () => {
            await this.router.navigate(['/order/shipping']);
          },
        });
    }
  }
}
