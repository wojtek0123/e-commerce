import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  effect,
  inject,
  OnInit,
  untracked,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  EditingField,
  InformationStore,
} from '@e-commerce/client-web/account/data-access';
import {
  FormFieldComponent,
  LabelComponent,
} from '@e-commerce/client-web/shared/ui';
import { ErrorMessageDirective } from '@e-commerce/client-web/shared/utils';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { Message } from 'primeng/message';
import { PasswordModule } from 'primeng/password';
import { distinctUntilChanged } from 'rxjs';

@Component({
  selector: 'lib-new-email-form',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    FormsModule,
    FormFieldComponent,
    ButtonModule,
    InputTextModule,
    PasswordModule,
    LabelComponent,
    Message,
    ErrorMessageDirective,
  ],
  templateUrl: './new-email-form.component.html',
})
export class NewEmailFormComponent implements OnInit {
  private readonly informationStore = inject(InformationStore);
  #destroyRef = inject(DestroyRef);

  public form = new FormGroup<{
    email: FormControl<string | null>;
    password?: FormControl<string | null>;
    firstName: FormControl<string | null>;
    lastName: FormControl<string | null>;
    phone: FormControl<string | null>;
  }>({
    email: new FormControl<string | null>(null),
    password: new FormControl<string | null>(null, Validators.required),
    firstName: new FormControl<string | null>(null),
    lastName: new FormControl<string | null>(null),
    phone: new FormControl<string | null>(null),
  });
  public userEmail = this.informationStore.email;
  user = this.informationStore.user;
  public loading = this.informationStore.loading;

  isDialogVisible = computed(() => !!this.informationStore.editingField());

  constructor() {
    effect(() => {
      const isDialogVisible = this.isDialogVisible();
      const user = this.user();

      untracked(() => {
        if (!isDialogVisible)
          this.form.reset(
            {
              email: null,
              password: null,
              firstName: user?.userInformation?.firstName,
              lastName: user?.userInformation?.lastName,
              phone: user?.userInformation?.phone,
            },
            { emitEvent: false },
          );
      });
    });
  }

  ngOnInit(): void {
    this.form.controls.email.valueChanges
      .pipe(distinctUntilChanged(), takeUntilDestroyed(this.#destroyRef))
      .subscribe((value) => {
        if (value) {
          this.form.addControl(
            'password',
            new FormControl<string | null>(null, Validators.required),
            { emitEvent: false },
          );
        } else {
          this.form.removeControl('password', { emitEvent: false });
        }
      });
  }

  public setEditingField(editingField: EditingField) {
    this.informationStore.setEditingField(editingField);
  }

  public submit() {
    Object.keys(this.form.controls).forEach((control) => {
      this.form.get(control)?.markAsDirty();
    });

    if (this.form.invalid) return;

    const { email, password, firstName, lastName, phone } = this.form.value;

    this.informationStore.updateUser$({
      body: {
        ...(email && { email }),
        ...(firstName && { firstName }),
        ...(lastName && { lastName }),
        ...(phone && { phone }),
        password: password ?? '',
      },
    });
  }
}
