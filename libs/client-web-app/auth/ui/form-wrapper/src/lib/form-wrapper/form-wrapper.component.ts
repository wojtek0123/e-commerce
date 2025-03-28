import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'e-commerce-form-wrapper',
  standalone: true,
  imports: [ButtonModule, NgIf, RouterLink, ReactiveFormsModule],
  templateUrl: './form-wrapper.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormWrapperComponent {
  @Input({ required: true }) title!: string;
  @Input({ required: true }) text!: string;
  @Input({ required: true }) link!: { url: string; name: string };
  @Input({ required: true }) submitButtonLabel!: string;
  @Output() submitEvent = new EventEmitter<void>();

  onSubmit(event: Event) {
    event.preventDefault();
    this.submitEvent.emit();
  }
}
