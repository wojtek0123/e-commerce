import {
  Component,
  DestroyRef,
  HostBinding,
  inject,
  OnInit,
} from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { ErrorMessageComponent } from '@e-commerce/client-web/shared/ui';
import { InputOtpModule } from 'primeng/inputotp';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { orderProcessActions } from '@e-commerce/client-web/cart/data-access';
import { Store } from '@ngrx/store';

@Component({
  selector: 'lib-six-digit-code-form',
  standalone: true,
  imports: [InputOtpModule, ReactiveFormsModule, ErrorMessageComponent],
  templateUrl: './six-digit-code-form.component.html',
  styleUrl: './six-digit-code-form.component.scss',
})
export class SixDigitCodeFormComponent implements OnInit {
  private readonly store = inject(Store);
  private readonly destroyRef = inject(DestroyRef);

  protected sixDigitNumberControl = new FormControl<string | null>(null, [
    Validators.required,
    Validators.minLength(6),
  ]);

  @HostBinding('style.margin') margin = '0 auto';

  ngOnInit(): void {
    this.sixDigitNumberControl.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((value) => {
        this.store.dispatch(
          orderProcessActions.setSixDigitCode({ code: value }),
        );
      });
  }
}
