import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { ActiveFilter } from '@e-commerce/client-web/browse/data-access';

@Component({
  selector: 'lib-display-active-filters',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
  templateUrl: './display-active-filters.component.html',
})
export class DisplayActiveFiltersComponent {
  filterName = input.required<string>();
  activeFilters = input.required<ActiveFilter[]>();
}
