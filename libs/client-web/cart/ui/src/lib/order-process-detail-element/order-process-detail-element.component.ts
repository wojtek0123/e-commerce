import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { CurrencyPipe, NgClass } from '@angular/common';
import { RadioButtonModule } from 'primeng/radiobutton';
import { CheckboxModule } from 'primeng/checkbox';

@Component({
  selector: 'lib-order-process-detail-element',
  standalone: true,
  imports: [CurrencyPipe, RadioButtonModule, CheckboxModule, NgClass],
  templateUrl: './order-process-detail-element.component.html',
  styleUrl: './order-process-detail-element.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderProcessDetailElementComponent<T> {
  label = input<string>();
  price = input.required<number>();
  value = input.required<T>();
  isActive = input.required<boolean>();

  clickEvent = output<T>();
}
