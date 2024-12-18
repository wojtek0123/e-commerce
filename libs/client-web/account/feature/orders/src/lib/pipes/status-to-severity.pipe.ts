import { Pipe, PipeTransform } from '@angular/core';
import { OrderDetailsStatus } from '@e-commerce/shared/api-models';

@Pipe({ name: 'statusToSeverity', standalone: true })
export class StatusToServerityPipe implements PipeTransform {
  transform(orderDetailsStatus: OrderDetailsStatus) {
    switch (orderDetailsStatus) {
      case 'NEW':
        return 'danger';
      case 'PROCESSING':
        return 'warn';
      case 'SHIPPED':
        return 'info';
      case 'COMPLETED':
        return 'success';
    }
  }
}
