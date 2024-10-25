import { Component, computed, effect, inject, untracked } from '@angular/core';
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
import { SidebarLeftDirective } from '@e-commerce/client-web/shared/utils';
import { DialogModule } from 'primeng/dialog';
import { NewEmailFormComponent } from './components/new-email-form/new-email-form.component';
import { AuthService } from '@e-commerce/client-web/auth/api';

@Component({
  selector: 'lib-information',
  standalone: true,
  imports: [
    OrderProcessItemDirective,
    SkeletonModule,
    ButtonModule,
    TooltipModule,
    InputTextModule,
    NewPasswordFormComponent,
    DrawerModule,
    NgTemplateOutlet,
    SidebarModule,
    SidebarLeftDirective,
    DialogModule,
    NewEmailFormComponent,
  ],
  templateUrl: './information.component.html',
})
export class InformationComponent {
  private readonly informationStore = inject(InformationStore);
  private readonly authService = inject(AuthService);

  public user = this.informationStore.user;
  public loading = this.informationStore.userLoading;
  public error = this.informationStore.userError;
  public editingField = this.informationStore.userEditingField;

  public userId = this.authService.userId;

  protected getUserEffect = effect(() => {
    const userId = this.userId();

    untracked(() => {
      if (userId) {
        this.informationStore.getUser$({ id: userId });
      }
    });
  });

  public isSidebarVisible = computed(() => !!this.editingField());

  setEditingField(editingField: EditingField) {
    this.informationStore.setEditingField(editingField);
  }
}
