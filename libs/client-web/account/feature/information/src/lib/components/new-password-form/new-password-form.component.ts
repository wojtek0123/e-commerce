import { Component, computed, effect, inject, untracked } from '@angular/core';
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
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { SkeletonModule } from 'primeng/skeleton';
import {
  canMatchPasswordValidator,
  createStrongPasswordValidator,
  ErrorMessageDirective,
} from '@e-commerce/client-web/shared/utils';
import { Message } from 'primeng/message';

@Component({
  selector: 'lib-new-password-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    SkeletonModule,
    ButtonModule,
    InputTextModule,
    FormFieldComponent,
    PasswordModule,
    FormsModule,
    LabelComponent,
    ErrorMessageDirective,
    Message,
  ],
  templateUrl: './new-password-form.component.html',
})
export class NewPasswordFormComponent {
  private readonly informationStore = inject(InformationStore);

  public form = new FormGroup(
    {
      newPassword: new FormControl<string | null>(null, [
        Validators.required,
        createStrongPasswordValidator(),
      ]),
      newPasswordConfirmation: new FormControl<string | null>(
        null,
        Validators.required,
      ),
      oldPassword: new FormControl<string | null>(null, Validators.required),
    },
    {
      validators: [
        canMatchPasswordValidator('newPassword', 'newPasswordConfirmation'),
      ],
    },
  );

  isDialogVisible = computed(() => !!this.informationStore.editingField());

  constructor() {
    effect(() => {
      this.isDialogVisible();

      untracked(() => {
        if (!this.isDialogVisible()) this.form.reset();
      });
    });
  }

  public setEditingField(editingField: EditingField) {
    this.informationStore.setEditingField(editingField);
  }

  public updatePassword() {
    Object.keys(this.form.controls).forEach((control) =>
      this.form.get(control)?.markAsDirty(),
    );

    if (this.form.invalid) return;

    const { newPassword, oldPassword } = this.form.value;

    this.informationStore.updateUser$({
      body: { password: oldPassword ?? '', newPassword: newPassword ?? '' },
    });
  }
}
