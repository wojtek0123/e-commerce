import { NgClass } from '@angular/common';
import { Component, inject } from '@angular/core';
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
import { FormFieldComponent } from '@e-commerce/client-web/shared/ui';
import { OrderProcessItemDirective } from '@e-commerce/client-web/shared/utils';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { SkeletonModule } from 'primeng/skeleton';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'lib-new-password-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    OrderProcessItemDirective,
    SkeletonModule,
    ButtonModule,
    TooltipModule,
    InputTextModule,
    FormFieldComponent,
    PasswordModule,
    NgClass,
    FormsModule,
  ],
  templateUrl: './new-password-form.component.html',
})
export class NewPasswordFormComponent {
  private readonly informationStore = inject(InformationStore);

  public form = new FormGroup({
    newPassword: new FormControl<string | null>(null, Validators.required),
    newPasswordConfirmed: new FormControl<string | null>(
      null,
      Validators.required,
    ),
    oldPassword: new FormControl<string | null>(null, Validators.required),
  });

  public setEditingField(editingField: EditingField) {
    this.informationStore.setEditingField(editingField);
  }

  public updatePassword() {
    const { newPassword, oldPassword } = this.form.value;

    this.informationStore.updateUser$({
      body: { password: oldPassword ?? '', newPassword: newPassword ?? '' },
    });
  }
}
