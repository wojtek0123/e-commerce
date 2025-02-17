import {
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChildren,
  OnInit,
  Signal,
  signal,
} from '@angular/core';
import { AccordionPanelComponent } from './accordion-panel.component';

@Component({
  selector: 'lib-accordion',
  template: ` <ng-content /> `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'flex rounded-base overflow-hidden flex-col gap-0',
  },
})
export class AccordionComponent {
  selected = signal<number>(-1);

  items = contentChildren(AccordionPanelComponent);
}
