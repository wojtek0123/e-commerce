import { Directive } from '@angular/core';
import { BookTag } from '@e-commerce/client-web/shared/data-access/api-models';
import { AbstractSelectItemsFilterDirective } from './select-item-filter.directive';

@Directive({
  selector: 'lib-filter[libTags]',
  standalone: true,
})
export class TagsDirective extends AbstractSelectItemsFilterDirective<BookTag> {
  override triggerGetItems = (search: string) =>
    this.booksStore.getTags(search);
  override selectedItems = this.booksStore.selectedTags;
  override items = this.booksStore.filters.tag.items;
  override trackFn = (_: number, item: BookTag) => item;
  override getItemLabel = (item: BookTag) => item;
  override placeholder = 'Search for tag';
  override readonly filterName = 'tag';

  constructor() {
    super();
    // this.filterComponent.trackFn = this.trackFn;
    this.filterComponent.getLabelItem = this.getItemLabel;
    this.filterComponent.filterName.set(this.filterName);
    this.filterComponent.placeholder.set(this.placeholder);
  }
}
