import {
  ChangeDetectionStrategy,
  Component,
  Input,
  Output,
} from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';
import { EventEmitter } from '@angular/core';
import { FormGroupState, NgrxFormsModule } from 'ngrx-forms';

@Component({
  selector: 'e-commerce-form-wrapper',
  standalone: true,
  imports: [ButtonModule, NgIf, RouterLink, NgrxFormsModule],
  templateUrl: './form-wrapper.component.html',
  styleUrls: ['./form-wrapper.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormWrapperComponent {
  @Input({ required: true }) title!: string;
  @Input({ required: true }) text!: string;
  @Input({ required: true }) link!: { url: string; name: string };
  @Input({ required: true }) submitButtonLabel!: string;
  @Input({ required: true }) formState!: FormGroupState<any>;
  @Output() submitEvent = new EventEmitter<void>();

  onSubmit() {
    this.submitEvent.emit();
  }
}
