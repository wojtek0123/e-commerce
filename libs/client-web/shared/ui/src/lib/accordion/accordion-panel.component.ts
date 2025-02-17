import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  forwardRef,
  inject,
  input,
} from '@angular/core';
import { AccordionComponent } from './accordion.component';
import { last } from 'rxjs';

@Component({
  selector: 'lib-accordion-panel',
  template: `
    <button
      class="bg-surface-100 dark:bg-surface-950 p-6 flex items-center justify-between w-full"
      (click)="toggle()"
    >
      <ng-content select="[slot='header']" />
      <span
        class="pi"
        [class.pi-angle-up]="extended()"
        [class.pi-angle-down]="!extended()"
      ></span>
    </button>
    <div
      class="bg-surface-100 dark:bg-surface-950 overflow-hidden transition-[height,visibility] duration-200 ease-in-out"
      [class.h-0.invisible]="!extended()"
      [class.h-auto.visible]="extended()"
    >
      <div class="  p-base">
        <ng-content select="[slot='content']" />
      </div>
    </div>
    <div class="bg-surface-100 dark:bg-surface-950 h-[1px] w-full"></div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'overflow-hidden',
  },
})
export class AccordionPanelComponent {
  accordion = inject<AccordionComponent>(forwardRef(() => AccordionComponent));

  key = input.required<number>();

  extended = computed(() => this.selected() === this.key());
  selected = computed(() => this.accordion.selected());

  toggle() {
    this.accordion.selected.update((selected) =>
      selected === this.key() ? -1 : this.key(),
    );
  }
}
