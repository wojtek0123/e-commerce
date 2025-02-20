import { Pipe, PipeTransform } from '@angular/core';
import { BookTag } from '@e-commerce/shared/api-models';

type Severity =
  | 'secondary'
  | 'success'
  | 'info'
  | 'warn'
  | 'danger'
  | 'contrast'
  | undefined;

@Pipe({
  name: 'bookTagToSeverity',
})
export class BookTagToSeverityPipe implements PipeTransform {
  transform(bookTag?: BookTag): Severity {
    switch (bookTag) {
      case BookTag.BESTSELLER:
        return 'contrast';
      case BookTag.NEW:
        return 'danger';
      case BookTag.INCOMING:
        return 'info';
      case BookTag.DISCOUNT:
        return 'warn';
      case BookTag.PREMIERE_OF_THE_MONTH:
        return 'danger';
      default:
        return undefined;
    }
  }
}
