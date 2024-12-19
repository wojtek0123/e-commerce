import { NgClass } from '@angular/common';
import { Component, input } from '@angular/core';

@Component({
  selector: 'lib-label',
  standalone: true,
  imports: [NgClass],
  templateUrl: './label.component.html',
})
export class LabelComponent {
  invalid = input<boolean>(false);
  idFor = input.required<string>();
}
