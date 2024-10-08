import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { ActiveFilter } from '@e-commerce/client-web/browse/data-access';
import { ButtonModule } from 'primeng/button';
import { ChipModule } from 'primeng/chip';

@Component({
  selector: 'lib-active-filters',
  standalone: true,
  imports: [ButtonModule, ChipModule],
  templateUrl: './active-filters.component.html',
  styleUrl: './active-filters.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ActiveFiltersComponent {
  public activeFilters = input.required<ActiveFilter[]>();

  public clearFiltersEvent = output<void>();
  public clearFilterEvent = output<ActiveFilter>();
}
