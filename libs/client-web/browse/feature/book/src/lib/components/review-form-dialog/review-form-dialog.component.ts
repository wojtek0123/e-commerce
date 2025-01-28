import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { BookStore } from '@e-commerce/client-web/browse/data-access';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { RatingModule } from 'primeng/rating';
import {
  FormFieldComponent,
  LabelComponent,
} from '@e-commerce/client-web/shared/ui';
import { TextareaModule } from 'primeng/textarea';

@Component({
  selector: 'lib-review-form-dialog',
  imports: [
    DialogModule,
    ButtonModule,
    RatingModule,
    TextareaModule,
    ReactiveFormsModule,
    FormFieldComponent,
    LabelComponent,
    FormsModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './review-form-dialog.component.html',
})
export class ReviewFormDialogComponent {
  #bookStore = inject(BookStore);

  visible = signal(false);

  form = new FormGroup({
    rating: new FormControl<number>(0, {
      nonNullable: true,
      validators: Validators.required,
    }),
    message: new FormControl<string>(''),
  });

  openDialog() {
    this.visible.set(true);
  }

  cancel() {
    this.visible.set(false);
  }

  submit() {
    this.#bookStore.addReview({
      rating: this.form.value.rating!,
      message: this.form.value.message!,
    });
  }
}
