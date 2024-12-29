import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';

import { Select } from 'primeng/select';
import { ButtonModule } from 'primeng/button';
import {
  BooksSort,
  BooksSortDirection,
  BooksSortKey,
} from '@e-commerce/client-web/browse/data-access';
import { FormsModule } from '@angular/forms';
import { startCase, camelCase, upperFirst } from 'lodash-es';

@Component({
  selector: 'lib-sort',
  templateUrl: './sort.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Select, ButtonModule, FormsModule],
})
export class SortComponent {
  sort = input.required<string, BooksSort>({ transform: transformOption });
  options = input.required<string[], BooksSort[]>({
    transform: this.transformOptions,
  });

  onChangeSort = output<BooksSort>();

  changeSort(value: string) {
    const [key, direction] = value.split('\t');

    this.onChangeSort.emit({
      key: camelCase(key) as BooksSortKey,
      direction: direction as BooksSortDirection,
    });
  }

  transformOptions(options: BooksSort[]) {
    return options.map(transformOption);
  }
}

function transformOption(option: BooksSort) {
  return (
    upperFirst(startCase(option.key).toLowerCase()) + '\t' + option.direction
  );
}
