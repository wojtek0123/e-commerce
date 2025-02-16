import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'lib-remove-saved-filters',
  templateUrl: './remove-saved-filters.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ButtonModule],
})
export class RemoveSavedFiltersComponent {}
