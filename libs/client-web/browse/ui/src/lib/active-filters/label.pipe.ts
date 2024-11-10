import { Pipe, PipeTransform } from '@angular/core';
import { ActiveFilter } from '@e-commerce/client-web/browse/data-access';

@Pipe({
  name: 'label',
  standalone: true,
})
export class LabelPipe implements PipeTransform {
  transform(activeFilter: ActiveFilter) {
    return `${activeFilter.filter}: ${activeFilter.value}`;
  }
}
