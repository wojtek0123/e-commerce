import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'e-commerce-button',
  templateUrl: './button.component.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, MatButtonModule, MatIconModule],
})
export class ButtonComponent {
  @Input({ required: true }) name = '';
  @Input() iconName: string | null = null;
  @Input() disable = false;
  @Input() color: 'primary' | 'accent' | 'warning' | 'disabled' = 'primary';
  @Output() clickEvent = new EventEmitter();

  onClick(event: Event) {
    event.preventDefault();
    event.stopImmediatePropagation();
    this.clickEvent.emit();
  }
}
