import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  FormControl,
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
import { TooltipModule } from 'primeng/tooltip';

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
    TooltipModule,
  ],
  templateUrl: './new-email-form.component.html',
})
export class NewEmailFormComponent {
  private readonly informationStore = inject(InformationStore);

  public newEmail = new FormControl<string | null>(null, Validators.required);

  public setEditingField(editingField: EditingField) {
    this.informationStore.setEditingField(editingField);
  }

  public updateEmail() {
    this.informationStore.updateUser$({
      body: { email: this.newEmail.value ?? '' },
    });
  }
}
