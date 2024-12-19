import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import { SkeletonModule } from 'primeng/skeleton';

@Component({
  selector: 'lib-form-field',
  standalone: true,
  imports: [InputTextModule, SkeletonModule],
  templateUrl: './form-field.component.html',
  styleUrl: './form-field.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'w-full',
  },
})
export class FormFieldComponent {
  labelSkeletonWidth = input<string>('5rem');
  inputSkeletonWidth = input<string>('100%');
  isInvalid = input<boolean>(false);
}
