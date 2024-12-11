import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputOtpModule } from 'primeng/inputotp';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { PaymentStore } from '@e-commerce/client-web/cart/data-access';

@Component({
  selector: 'lib-six-digit-code-form',
  standalone: true,
  imports: [InputOtpModule, ReactiveFormsModule],
  templateUrl: './six-digit-code-form.component.html',
  host: {
    class: 'flex items-center justify-center',
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
