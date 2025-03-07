import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  untracked,
} from '@angular/core';
import {
  EditingField,
  InformationStore,
} from '@e-commerce/client-web/account/data-access';
import { OrderProcessItemDirective } from '@e-commerce/client-web/shared/utils';
import { ButtonModule } from 'primeng/button';
import { SkeletonModule } from 'primeng/skeleton';
import { TooltipModule } from 'primeng/tooltip';
import { InputTextModule } from 'primeng/inputtext';
import { NewPasswordFormComponent } from '../new-password-form/new-password-form.component';
import { DialogModule } from 'primeng/dialog';
import { NewEmailFormComponent } from '../new-email-form/new-email-form.component';
import { AuthService } from '@e-commerce/client-web/auth/api';
import { ErrorAndRetryMessageComponent } from '@e-commerce/client-web/shared/ui';

@Component({
  selector: 'lib-account-data',
  standalone: true,
  imports: [
    OrderProcessItemDirective,
    SkeletonModule,
    ButtonModule,
    TooltipModule,
    InputTextModule,
    NewPasswordFormComponent,
    DialogModule,
    NewEmailFormComponent,
    ErrorAndRetryMessageComponent,
  ],
  templateUrl: './account-data.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountDataComponent {
  #informationStore = inject(InformationStore);
  #authService = inject(AuthService);

  loading = this.#informationStore.loading;
  error = this.#informationStore.error;
  user = this.#informationStore.user;
  editingField = this.#informationStore.editingField;

  userId = this.#authService.userId;

  getUserEffect = effect(() => {
    this.userId();

    untracked(() => {
      this.getUserInformation();
    });
  });

  isDialogVisible = computed(() => !!this.editingField());
  dialogHeader = computed(
    () => `Change ${this.editingField() === 'password' ? 'password' : 'email'}`,
  );

  getUserInformation() {
    const userId = this.userId();

    if (!userId) return;

    this.#informationStore.getUser$({ id: userId });
  }

  setEditingField(editingField: EditingField) {
    this.#informationStore.setEditingField(editingField);
  }
}
