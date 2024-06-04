import {
  Component,
  HostBinding,
  OnInit,
  inject,
  input,
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
import { countries } from '../countries';
import { NgClass } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { UserAddress } from '@e-commerce/client-web-app/shared/data-access/api-types';
import { UserAddressApiService } from '@e-commerce/client-web-app/shared/data-access/api-services';

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
  ],
  templateUrl: './order-details.component.html',
  styleUrl: './order-details.component.css',
})
export class OrderDetailsComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private userAddressApi = inject(UserAddressApiService);

  @HostBinding('class') class = 'flex flex-column gap-6';

  form = new FormGroup({
    firstName: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    lastName: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    city: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    street: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    houseNumber: new FormControl<string>('', { nonNullable: true }),
    homeNumber: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    postcode: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    phone: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    country: new FormControl<{ name: string; code: string } | null>(null, {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });

  userAddress = signal<UserAddress | null>(null);

  countries = countries;
  submitted = signal(false);
  loading = signal(false);

  ngOnInit(): void {
    this.userAddress.set(this.route.snapshot.data['userAddress'] ?? null);
  }

  submit() {
    this.submitted.set(true);

    if (this.form.invalid) {
      return;
    }

    this.loading.set(true);
    // jeśli użtkownik nie ma stworzonego profilu z danymi adresowymi to je stwórz
    // jeśli użtkownik ma i nic nie zminiał to nic nie rób
    // jeśli ma i je zmienił to zaktualizuj
    if (Object.entries(this.form.value).some((v) => !v)) return;
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
    this.userAddressApi.createUserAddress({
      firstName: firstName ?? '',
      lastName: lastName ?? '',
      city: city ?? '',
      street: street ?? '',
      homeNumber: homeNumber ?? '',
      houseNumber: houseNumber ?? '',
      phone: phone ?? '',
      postcode: postcode ?? '',
    });
  }
}
