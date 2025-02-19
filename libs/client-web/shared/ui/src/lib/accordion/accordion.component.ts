import {
  ChangeDetectionStrategy,
  Component,
  contentChildren,
  input,
  model,
} from '@angular/core';
import {
  AccordionPanelComponent,
  AccordionPanelKey,
} from './accordion-panel.component';

@Component({
  selector: 'lib-accordion',
  template: ` <ng-content /> `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'flex rounded-base overflow-hidden flex-col gap-0',
  },
})
export class AccordionComponent {
  selected = model<AccordionPanelKey[]>([]);

  multiple = input(false);
  color = input<'content' | 'surface'>('content');

  items = contentChildren(AccordionPanelComponent);

  toggle(key: AccordionPanelKey) {
    const extended = this.selected().includes(key);

    if (this.multiple()) {
      this.selected.update((selected) =>
        extended ? selected.filter((s) => s !== key) : [...selected, key],
      );
    } else {
      this.selected.set(extended ? [] : [key]);
    }
  }
}
