import { Pipe, PipeTransform } from '@angular/core';
import { OrderStatus } from '@prisma/client';

@Pipe({ name: 'statusToSeverity', standalone: true })
export class StatusToServerityPipe implements PipeTransform {
  transform(orderDetailsStatus: OrderStatus) {
    switch (orderDetailsStatus) {
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
