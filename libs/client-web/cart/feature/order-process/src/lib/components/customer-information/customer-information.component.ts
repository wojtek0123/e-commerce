import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  untracked,
} from '@angular/core';
import { SectionWrapperComponent } from '@e-commerce/client-web/cart/ui';
import { AuthService } from '@e-commerce/client-web/auth/api';
import { UserInformationComponent } from '@e-commerce/client-web/shared/ui';
import { Dialog } from 'primeng/dialog';
import { CustomerInformationStore } from '@e-commerce/client-web/cart/data-access';
import { CustomerInformationFormComponent } from './customer-information-form/customer-information-form.component';

@Component({
  selector: 'lib-customer-information',
  templateUrl: './customer-information.component.html',
  imports: [
    SectionWrapperComponent,
    UserInformationComponent,
    Dialog,
    CustomerInformationFormComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomerInformationComponent {
  #authService = inject(AuthService);
  #customerInformationStore = inject(CustomerInformationStore);

  user = this.#customerInformationStore.user;
  isFormVisible = this.#customerInformationStore.isFormVisible;

  userId = this.#authService.userId;

  getUserEffect = effect(() => {
    this.userId();

    untracked(() => {
      this.getUserInformation();
    });
  });

  getUserInformation() {
    const userId = this.userId();

    if (!userId) return;

    this.#customerInformationStore.getUser$({ id: userId });
  }

  edit() {
    this.#customerInformationStore.showForm();
  }

  hideForm() {
    this.#customerInformationStore.hideForm();
  }
}
