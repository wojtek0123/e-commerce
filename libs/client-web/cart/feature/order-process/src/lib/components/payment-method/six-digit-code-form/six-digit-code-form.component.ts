import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { ErrorMessageComponent } from '@e-commerce/client-web/shared/ui';
import { InputOtpModule } from 'primeng/inputotp';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { PaymentStore } from '@e-commerce/client-web/cart/data-access';

@Component({
  selector: 'lib-six-digit-code-form',
  standalone: true,
  imports: [InputOtpModule, ReactiveFormsModule, ErrorMessageComponent],
  templateUrl: './six-digit-code-form.component.html',
  styleUrl: './six-digit-code-form.component.scss',
  host: {
    class: 'mx-auto',
  },
})
export class SixDigitCodeFormComponent implements OnInit {
  private readonly paymentStore = inject(PaymentStore);
  private readonly destroyRef = inject(DestroyRef);

  protected sixDigitNumberControl = new FormControl<string | null>(null, [
    Validators.required,
    Validators.minLength(6),
  ]);

  public ngOnInit(): void {
    this.sixDigitNumberControl.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((code) => {
        this.paymentStore.enterSixDigitCode(code);
      });
  }
}
