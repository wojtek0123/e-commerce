import { PipeTransform, Pipe } from '@angular/core';

@Pipe({
  name: 'toLowerCase',
})
export class ToLowerCasePipe implements PipeTransform {
  transform(text: string) {
    return text.toLowerCase();
  }
}
