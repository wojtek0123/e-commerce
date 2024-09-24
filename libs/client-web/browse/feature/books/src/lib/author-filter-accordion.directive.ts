import { Directive, inject, OnInit } from '@angular/core';
import { allBookTags } from '@e-commerce/client-web/shared/data-access';
import { AccordionTab } from 'primeng/accordion';

@Directive({
  selector: 'p-accordionTab[libAuthorFilter]',
  standalone: true,
})
export class AuthorFilterDirective implements OnInit {
  private accordionTab = inject(AccordionTab);
  private items = allBookTags;

  ngOnInit(): void {}
}
