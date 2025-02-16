import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
} from '@angular/core';
import { ActiveFilter } from '@e-commerce/client-web/browse/data-access';
import { ButtonModule } from 'primeng/button';
import { ChipModule } from 'primeng/chip';
import { TooltipModule } from 'primeng/tooltip';
import { LabelPipe } from './label.pipe';
import { BadgeModule } from 'primeng/badge';

@Component({
  selector: 'lib-active-filters',
  standalone: true,
  imports: [ButtonModule, ChipModule, TooltipModule, LabelPipe, BadgeModule],
  templateUrl: './active-filters.component.html',
  styleUrl: './active-filters.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ActiveFiltersComponent {
  public activeFilters = input.required<ActiveFilter[]>();

  public onClearFilters = output<void>();
  public onClearFilter = output<ActiveFilter>();

  activeFiltersCount = computed(() => this.activeFilters().length.toString());

  public clearFilters() {
    if (this.activeFilters().length === 0) return;

    this.onClearFilters.emit();
  }
}
