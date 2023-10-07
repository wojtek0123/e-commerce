import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  booleanAttribute,
} from '@angular/core';
import { MatCheckboxModule } from '@angular/material/checkbox';

@Component({
  selector: 'e-commerce-checkbox',
  template: `
    <div class="flex items-center gap-2">
      <mat-checkbox
        [id]="id"
        (change)="onChange()"
        class="!text-blue-400"
      ></mat-checkbox>
      <label [htmlFor]="id">{{ name }}</label>
    </div>
  `,
  standalone: true,
  imports: [MatCheckboxModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CheckboxComponent {
  @Input() name = '';
  @Input({ transform: booleanAttribute }) checked = false;
  @Output() changeEvent = new EventEmitter<boolean>();

  id = Math.random().toString();

  onChange() {
    this.checked = !this.checked;
    this.changeEvent.emit(this.checked);
  }
}
