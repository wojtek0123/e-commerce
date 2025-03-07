import { Pipe, PipeTransform } from '@angular/core';
import { ActiveFilter } from '@e-commerce/client-web/browse/data-access';

@Pipe({
  name: 'getFiltersCount',
  standalone: true,
})
export class GetFiltersCount implements PipeTransform {
  transform(filter: Map<string, ActiveFilter[]>) {
    return [...filter.values()].reduce((acc, f) => acc + f.length, 0);
  }
}
