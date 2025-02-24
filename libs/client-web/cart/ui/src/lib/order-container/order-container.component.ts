import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'lib-order-container',
  templateUrl: './order-container.component.html',
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderContainerComponent {}
