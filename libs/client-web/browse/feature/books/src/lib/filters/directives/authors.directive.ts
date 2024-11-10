import { Directive, input } from '@angular/core';
import { Author } from '@e-commerce/client-web/shared/data-access/api-models';
import { AbstractSelectItemsFilterDirective } from './select-item-filter.directive';

@Directive({
  selector: 'lib-filter[libAuthors]',
  standalone: true,
})
export class AuthorsDirective extends AbstractSelectItemsFilterDirective<Author> {
  override triggerGetItems = (search: string) =>
    this.booksStore.getAuthors({ search });
  override selectedItems = this.booksStore.selectedAuthors;
  override trackFn = (_: number, item: Author) => item.id;
  override getItemLabel = (item: Author) => item.name;
  override placeholder = 'Search for author';
  override readonly filterName = 'author';
  override items = this.booksStore.filters.multiSelect.author.items;

  getItemId = input((item: Author) => item.id);

  constructor() {
    super();
    this.filterComponent.getItemId = this.getItemId;
    this.filterComponent.getLabelItem = this.getItemLabel;
    this.filterComponent.filterName.set(this.filterName);
    this.filterComponent.placeholder.set(this.placeholder);
  }
}
