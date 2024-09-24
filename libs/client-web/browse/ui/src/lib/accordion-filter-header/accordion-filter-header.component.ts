import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { BadgeModule } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'lib-accordion-filter-header',
  standalone: true,
  imports: [BadgeModule, ButtonModule],
  templateUrl: './accordion-filter-header.component.html',
  styleUrl: './accordion-filter-header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccordionFilterHeaderComponent {
  public selectedItemsCount = input.required<number>();
  public header = input.required();

  public clearSelectedItems = output<void>();

  public clearFilterSelectedItems() {
    this.clearSelectedItems.emit();
  }
}
