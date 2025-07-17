import {
  ChangeDetectionStrategy,
  Component,
  input,
  Pipe,
  PipeTransform,
} from '@angular/core';
import { Divider } from 'primeng/divider';
import { Badge } from 'primeng/badge';

@Pipe({
  name: 'formatText',
})
export class FormatTextPipe implements PipeTransform {
  transform(text: string) {
    return `${text.charAt(0).toUpperCase()}${text.slice(1).toLowerCase().replaceAll('_', ' ')}`;
  }
}

@Component({
  selector: 'lib-steps',
  imports: [Badge, Divider, FormatTextPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './steps.component.html',
})
export class StepsComponent {
  public steps = input<string[]>();
  public activeIndex = input<number>();
}
