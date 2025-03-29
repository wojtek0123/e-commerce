import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { APP_ROUTE_PATHS_TOKEN } from '@e-commerce/client-web/shared/app-config';
import { UnauthorizedDialogService } from '@e-commerce/client-web/shared/data-access/services';
import { Button } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';

@Component({
  selector: 'app-unauthorized-dialog',
  templateUrl: './unauthorized-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DialogModule, Button, RouterLink],
})
export class UnauthorizedDialogComponent {
  #appRoutePaths = inject(APP_ROUTE_PATHS_TOKEN);
  #dialogService = inject(UnauthorizedDialogService);

  loginUrl = this.#appRoutePaths.LOGIN();
  hidden = this.#dialogService.hidden;

  close() {
    this.#dialogService.close();
  }
}
