import { Component, HostBinding, input, signal } from '@angular/core';
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
  ],
  templateUrl: './order-details.component.html',
  styleUrl: './order-details.component.css',
})
export class OrderDetailsComponent {
  @HostBinding('class') class = 'flex flex-column gap-6';

  form = new FormGroup({
    firstName: new FormControl('', [Validators.required]),
    lastName: new FormControl('', [Validators.required]),
    city: new FormControl('', [Validators.required]),
    street: new FormControl('', [Validators.required]),
    houseNumber: new FormControl(''),
    homeNumber: new FormControl('', [Validators.required]),
    postcode: new FormControl('', [Validators.required]),
    phone: new FormControl('', [Validators.required]),
    country: new FormControl<{ name: string; code: string } | null>(null, [
      Validators.required,
    ]),
  });

  callback = input.required<any>();

  countries = countries;
  submitted = signal(false);
  loading = signal(false);

  submit() {
    this.submitted.set(true);
    this.loading.set(true);

    if (this.form.invalid) return;

    this.callback().next();
  }
}
