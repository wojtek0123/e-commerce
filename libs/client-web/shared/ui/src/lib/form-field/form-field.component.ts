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
  label = input.required<string>();
  isRequired = input<boolean>(false);
  isLoading = input<boolean>(false);
  labelSkeletonWidth = input<string>('5rem');
  inputSkeletonWidth = input<string>('100%');
}
