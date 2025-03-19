import { Pipe, PipeTransform } from '@angular/core';
import { OrderStatus } from '@e-commerce/shared/api-models';

@Pipe({ name: 'statusToSeverity', standalone: true })
export class StatusToServerityPipe implements PipeTransform {
  transform(orderStatus: OrderStatus) {
    switch (orderStatus) {
      case 'NEW':
        return 'danger';
      case 'PACKING':
        return 'warn';
      case 'PREPARED_FOR_SHIPPING':
        return 'info';
      case 'SHIPPED':
        return 'success';
    }
  }
}
