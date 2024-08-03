import { Component, OnInit, inject, signal } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { StepService } from '@e-commerce/client-web-app/order/data-access';
import {
  FormGroup,
  FormControl,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NgClass } from '@angular/common';
import { InputMaskModule } from 'primeng/inputmask';
import { Router, RouterLink } from '@angular/router';
import {
  FormFieldComponent,
  ErrorMessageComponent,
} from '@e-commerce/client-web-app/shared/ui/form-field';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'lib-payment',
  standalone: true,
  imports: [
    ButtonModule,
    NgClass,
    InputTextModule,
    InputMaskModule,
    ReactiveFormsModule,
    RouterLink,
    FormFieldComponent,
    ErrorMessageComponent,
    TooltipModule,
  ],
  template: `
    <form [formGroup]="form" class="flex flex-column gap-2">
      <lib-form-field label="Card number" [isRequired]="true">
        <p-inputMask
          slot="input"
          mask="9999 9999 9999 9999"
          class="w-full"
          id="card-number"
          [ngClass]="{
            'ng-invalid ng-dirty':
              form.controls.cardNumber.invalid && submitted(),
          }"
          formControlName="cardNumber"
          placeholder="Type your card number"
        />
        @if (
          (form.controls.cardNumber.dirty || submitted()) &&
          form.controls.cardNumber.invalid
        ) {
          <lib-error-message />
        }
      </lib-form-field>

      <div class="flex align-items-center gap-3">
        <lib-form-field label="Expiration date" [isRequired]="true">
          <p-inputMask
            slot="input"
            mask="99/9999"
            class="w-full"
            id="expiration-date"
            [ngClass]="{
              'ng-invalid ng-dirty':
                form.controls.expirationDate.invalid && submitted(),
            }"
            formControlName="expirationDate"
            placeholder="Type expiration date"
          />
          @if (
            form.controls.expirationDate.invalid &&
            (submitted() || form.controls.expirationDate.dirty)
          ) {
            <lib-error-message />
          }
        </lib-form-field>

        <lib-form-field label="Security code" [isRequired]="true">
          <p-inputMask
            slot="input"
            mask="999"
            class="w-full"
            id="security-code"
            [ngClass]="{
              'ng-invalid ng-dirty':
                form.controls.securityCode.invalid && submitted(),
            }"
            formControlName="securityCode"
            placeholder="Type security code"
          />
          @if (
            form.controls.securityCode.invalid &&
            (submitted() || form.controls.securityCode.dirty)
          ) {
            <lib-error-message />
          }
        </lib-form-field>
      </div>
    </form>

    <div class="flex align-items-center justify-content-between gap-3 mt-6">
      <p-button
        [outlined]="true"
        icon="pi pi-arrow-left"
        label="Back to shipping"
        routerLink="/order/shipping-method"
      />
      <p-button
        icon="pi pi-arrow-right"
        iconPos="right"
        label="Summary"
        [loading]="loading()"
        (onClick)="submit()"
      />
    </div>
  `,
  styles: [
    `
      :host ::ng-deep {
        .p-inputmask {
          width: 100%;
        }
      }
    `,
  ],
})
export class PaymentComponent implements OnInit {
  private stepService = inject(StepService);
  private router = inject(Router);

  protected waitingForOrderInformation =
    this.stepService.waitingForOrderInformation;

  loading = signal(false);
  submitted = signal(false);
  form = new FormGroup({
    cardNumber: new FormControl(null, Validators.required),
    expirationDate: new FormControl(null, Validators.required),
    securityCode: new FormControl(null, Validators.required),
  });

  ngOnInit(): void {
    this.stepService.changeStep('payment-method');
  }

  async submit() {
    this.submitted.set(true);
    if (this.form.invalid) return;

    // this.loading.set(true);

    this.stepService.setOrderInformation({
      paymentMethod: this.form.value.cardNumber,
    });
    await this.router.navigate(['/order/summary']);
  }
}
