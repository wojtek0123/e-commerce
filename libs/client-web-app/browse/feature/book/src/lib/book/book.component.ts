import { Component } from '@angular/core';
import { BookDetailsComponent } from '@e-commerce/client-web-app/browse/ui/book-details';

@Component({
  selector: 'lib-book',
  standalone: true,
  imports: [BookDetailsComponent],
  template: `<lib-book-details />`,
})
export class BookComponent {}
