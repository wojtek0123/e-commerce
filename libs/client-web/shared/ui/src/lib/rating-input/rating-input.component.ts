import {
  ChangeDetectionStrategy,
  Component,
  computed,
  forwardRef,
  input,
  model,
  signal,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'lib-rating-input',
  templateUrl: './rating-input.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => RatingInputComponent),
      multi: true,
    },
  ],
  host: {
    class: 'flex items-center gap-1',
    '[class.text-red-300]': 'invalid() && !disabled()',
    '[class.text-surface-400]': 'disabled()',
  },
})
export class RatingInputComponent implements ControlValueAccessor {
  starsCount = input<number>(5);
  readonly = input<boolean>(false);
  invalid = input(false);

  stars = computed(() => new Array(this.starsCount()));

  rate = model(0);
  disabled = signal(false);

  setRate(event: Event, rate: number) {
    event.preventDefault();

    if (this.disabled()) return;

    rate = rate === this.rate() ? 0 : rate;

    this.rate.set(rate);
    this.onChange(rate);
  }

  onChange = (rating: number) => {};

  onTouched = () => {};

  writeValue(rating: number | null): void {
    this.rate.set(rating || 0);
  }

  registerOnChange(fn: (rating: number) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled.set(isDisabled);
  }
}
