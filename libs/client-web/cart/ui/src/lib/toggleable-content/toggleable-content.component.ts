import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'lib-toggleable-content',
  templateUrl: './toggleable-content.component.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('contentExpansion', [
      state(
        'expanded',
        style({ height: '*', opacity: 1, visibility: 'visible' }),
      ),
      state(
        'collapsed',
        style({ height: '0px', opacity: 0, visibility: 'hidden' }),
      ),
      transition('expanded <=> collapsed', animate('300ms ease-in-out')),
    ]),
  ],
})
export class ToggleableContentComponent {
  public isExpanded = input.required<boolean>();
}
