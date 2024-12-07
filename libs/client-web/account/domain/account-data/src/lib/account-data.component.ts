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
import { NewPasswordFormComponent } from './components/new-password-form/new-password-form.component';
import { DrawerModule } from 'primeng/drawer';
import { SidebarModule } from 'primeng/sidebar';
import { NgTemplateOutlet } from '@angular/common';
import { DrawerLeftDirective } from '@e-commerce/client-web/shared/utils';
import { DialogModule } from 'primeng/dialog';
import { NewEmailFormComponent } from './components/new-email-form/new-email-form.component';
import { AuthService } from '@e-commerce/client-web/auth/api';
import { AddressInformationComponent } from '@e-commerce/client-web/shared/ui';

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
  ],
  templateUrl: './account-data.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountDataComponent {
  private readonly informationStore = inject(InformationStore);
  private readonly authService = inject(AuthService);

  public loading = this.informationStore.loading;
  public error = this.informationStore.error;
  public user = this.informationStore.user;
  public editingField = this.informationStore.editingField;

  public userId = this.authService.userId;

  protected getUserEffect = effect(() => {
    const userId = this.userId();

    untracked(() => {
      if (userId) {
        this.informationStore.getUser$({ id: userId });
      }
    });
  });

  public isDialogVisible = computed(() => !!this.editingField());
  public dialogHeader = computed(
    () => `Change ${this.editingField() === 'password' ? 'password' : 'email'}`,
  );

  public setEditingField(editingField: EditingField) {
    this.informationStore.setEditingField(editingField);
  }
}
