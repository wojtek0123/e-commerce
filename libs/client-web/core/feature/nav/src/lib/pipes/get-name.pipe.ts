import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'getName',
  standalone: true,
})
export class GetNamePipe implements PipeTransform {
  transform(name: string, isLabelShowed: boolean) {
    return isLabelShowed ? name : name.slice(0, 2);
  }
}
