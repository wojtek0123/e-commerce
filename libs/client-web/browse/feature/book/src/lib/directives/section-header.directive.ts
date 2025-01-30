import { Directive } from '@angular/core';

@Directive({
  selector: 'h1,h2,h3,h4,h5,h6[libSectionHeader]',
  standalone: true,
  host: {
    class: 'text-3xl font-bold mt-4',
  },
})
export class SectionHeaderDirective {}
