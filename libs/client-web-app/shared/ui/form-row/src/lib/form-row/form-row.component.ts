import { NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  input,
} from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import { SkeletonModule } from 'primeng/skeleton';

@Component({
  selector: 'lib-form-row',
  standalone: true,
  imports: [InputTextModule, SkeletonModule, NgClass],
  template: `
    @if (isLoading()) {
    <div class="flex flex-column gap-2">
      <p-skeleton [width]="labelSkeletonWidth()" height="1rem" />
      <p-skeleton [width]="inputSkeletonWidth()" height="2.2rem" />
    </div>
    } @else {
    <div class="flex flex-column w-full">
      <label class="flex flex-column gap-1">
        <span>{{ label() }} {{ isRequired() ? '*' : '' }}</span>
        <ng-content />
      </label>
      <div class="mt-1">
        <ng-content select="[slot='error-message'], lib-error-message" />
      </div>
    </div>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormRowComponent {
  label = input.required<string>();
  isRequired = input<boolean>(false);
  isLoading = input<boolean>(false);
  labelSkeletonWidth = input<string>('5rem');
  inputSkeletonWidth = input<string>('100%');

  @HostBinding('class') class = 'w-full';
}
