import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
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
  ErrorMessageComponent,
  FormFieldComponent,
} from '@e-commerce/client-web/shared/ui';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';

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
    ErrorMessageComponent,
    PasswordModule,
  ],
  templateUrl: './new-email-form.component.html',
})
export class NewEmailFormComponent {
  private readonly informationStore = inject(InformationStore);

  public form = new FormGroup({
    email: new FormControl<string | null>(null, Validators.required),
    password: new FormControl<string | null>(null, Validators.required),
  });
  public userEmail = this.informationStore.email;

  public setEditingField(editingField: EditingField) {
    this.informationStore.setEditingField(editingField);
  }

  public submit() {
    Object.keys(this.form.controls).forEach((control) => {
      this.form.get(control)?.markAsDirty();
    });

    if (this.form.invalid) return;

    this.informationStore.updateUser$({
      body: {
        email: this.form.value.email ?? '',
        password: this.form.value.password ?? '',
      },
    });
  }
}
