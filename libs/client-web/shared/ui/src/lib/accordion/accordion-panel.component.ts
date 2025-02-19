import {
  ChangeDetectionStrategy,
  Component,
  computed,
  forwardRef,
  inject,
  input,
} from '@angular/core';
import { AccordionComponent } from './accordion.component';
import { NgClass } from '@angular/common';

export type AccordionPanelKey = string | number;

@Component({
  selector: 'lib-accordion-panel',
  imports: [NgClass],
  template: `
    <button
      class="p-6 flex items-center justify-between w-full"
      [ngClass]="{
        'bg-surface-100 dark:bg-surface-950': color() === 'surface',
        'bg-content-background': color() === 'content',
      }"
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
      class="overflow-hidden transition-[height,visibility] duration-[400ms] ease-[cubic-bezier(0.86,0,0.07,1)]"
      [ngClass]="{
        'bg-surface-100 dark:bg-surface-950': color() === 'surface',
        'bg-content-background': color() === 'content',
      }"
      [class.h-0.invisible]="!extended()"
      [class.h-auto.visible]="extended()"
    >
      <div class="px-base pb-base">
        <ng-content select="[slot='content']" />
      </div>
    </div>
    @if (!last()) {
      <div class="bg-surface-200 dark:bg-surface-700 h-[1px] w-full"></div>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'overflow-hidden',
  },
})
export class AccordionPanelComponent {
  accordion = inject<AccordionComponent>(forwardRef(() => AccordionComponent));

  key = input.required<AccordionPanelKey>();

  extended = computed(
    () => this.selected().filter((s) => s === this.key()).length > 0,
  );
  selected = computed(() => this.accordion.selected());
  color = computed(() => this.accordion.color());

  last = computed(() => this.accordion.items().at(-1) === this);

  toggle() {
    this.accordion.toggle(this.key());
  }
}
