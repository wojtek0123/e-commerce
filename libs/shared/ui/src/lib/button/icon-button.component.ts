import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { ButtonDirective } from './button.directive';

@Component({
  selector: 'e-commerce-icon-button',
  templateUrl: './icon-button.component.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, ButtonDirective, MatIconModule],
})
export class IconButtonComponent {
  @Input() name: string | null = null;
  @Input() iconName: string | null = null;
  @Input() disabled = false;
  @Input() brand: 'outline' | 'primary' | 'basic' = 'primary';
  @Input() size: 'small' | 'medium' | 'large' = 'medium';
  @Output() clickEvent = new EventEmitter();

  onClick(event: Event) {
    event.preventDefault();
    event.stopImmediatePropagation();
    this.clickEvent.emit();
  }
}
