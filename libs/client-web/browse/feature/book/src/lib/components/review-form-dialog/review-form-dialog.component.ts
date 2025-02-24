import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  OnInit,
  untracked,
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
import { ErrorMessageDirective } from '@e-commerce/client-web/shared/utils';
import { MessageModule } from 'primeng/message';
import { InputTextModule } from 'primeng/inputtext';
import { AuthService } from '@e-commerce/client-web/auth/api';
import { Router, RouterLink } from '@angular/router';
import { RatingInputComponent } from '@e-commerce/client-web/shared/ui';
import { APP_QUERY_PARAMS } from '@e-commerce/client-web/shared/app-config';

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
    ErrorMessageDirective,
    MessageModule,
    InputTextModule,
    RouterLink,
    RatingInputComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './review-form-dialog.component.html',
})
export class ReviewFormDialogComponent implements OnInit {
  #bookStore = inject(BookStore);
  #authService = inject(AuthService);
  #router = inject(Router);

  redirectTo = APP_QUERY_PARAMS.REDIRECT_TO;

  isLoggedIn = this.#authService.isAuthenticated;
  userId = this.#authService.userId;
  isUserBoughtThisBook = this.#bookStore.purchased;

  url = this.#router.url;

  visible = this.#bookStore.reviewDialog.visible;
  loading = this.#bookStore.reviewDialog.loading;

  isUserAddedReview = computed(() =>
    this.#bookStore.isUserAddedReview(this.userId() ?? ''),
  );

  constructor() {
    effect(() => {
      const visible = this.visible();

      untracked(() => {
        if (visible) {
          this.form.reset();
        }
      });
    });
  }

  ngOnInit(): void {
    if (this.isLoggedIn()) {
      this.#bookStore.getOrderByBook();
    }
  }

  form = new FormGroup({
    name: new FormControl<string | null>(null, Validators.required),
    rating: new FormControl<number>(0, {
      nonNullable: true,
      validators: [Validators.min(1)],
    }),
    message: new FormControl<string>(''),
  });

  toggleDialog() {
    this.#bookStore.toggleReviewDialog();
  }

  submit() {
    Object.keys(this.form.controls).forEach((control) =>
      this.form.get(control)?.markAsDirty(),
    );

    if (this.form.invalid) return;

    this.#bookStore.addReview({
      name: this.form.value.name!,
      rating: this.form.value.rating!,
      message: this.form.value.message?.trim() ?? '',
    });
  }
}
