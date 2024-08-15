import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { Params, RouterLink } from '@angular/router';

@Component({
  selector: 'lib-container',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './container.component.html',
  styleUrl: './container.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContainerComponent {
  header = input.required<string>();
  subtitle = input.required<string>();
  link = input.required<{ url: string; label: string }>();

  queryParams = input<Params | null>(null);

  submitEvent = output<void>();

  onSubmit(event: Event) {
    event.preventDefault();
    this.submitEvent.emit();
  }
}
