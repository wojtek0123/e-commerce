import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  input,
} from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { NgIf } from '@angular/common';
import { Params, RouterLink } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

@Component({
  selector: 'e-commerce-form-wrapper',
  standalone: true,
  imports: [
    ButtonModule,
    NgIf,
    RouterLink,
    ReactiveFormsModule,
    ProgressSpinnerModule,
  ],
  templateUrl: './form-wrapper.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormWrapperComponent {
  @Input({ required: true }) header!: string;
  @Input({ required: true }) subtitle!: string;
  @Input({ required: true }) link!: { url: string; name: string };
  queryParams = input<Params | null>(null);

  @Output() submitEvent = new EventEmitter<void>();

  onSubmit(event: Event) {
    event.preventDefault();
    this.submitEvent.emit();
  }
}
