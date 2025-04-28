import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { User } from '@e-commerce/shared/api-models';
import { Button } from 'primeng/button';

@Component({
  selector: 'lib-user-information',
  templateUrl: './user-information.component.html',
  imports: [Button],
  host: { class: 'relative @container' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserInformationComponent {
  user = input.required<User | null>();
  removable = input<boolean>(true);

  editEvent = output<void>();
  removeEvent = output<void>();

  edit() {
    this.editEvent.emit();
  }

  delete() {
    this.removeEvent.emit();
  }
}
