import { Directive, input } from '@angular/core';
import { BookTag } from '@e-commerce/shared/api-models';
import { AbstractSelectItemsFilterDirective } from './select-item-filter.directive';

@Directive({
  selector: 'lib-filter[libTags]',
  standalone: true,
})
export class TagsDirective extends AbstractSelectItemsFilterDirective<{
  id: string;
  name: BookTag;
}> {
  override triggerGetItems = (search: string) =>
    this.booksStore.getTags(search);
  override selectedItems = this.booksStore.selectedTags;
  override items = this.booksStore.filters.multiSelect.tag.items;
  override trackFn = (_: number, item: { id: string; name: string }) => item.id;
  override getItemLabel = (item: { id: string; name: string }) =>
    item.name.toLowerCase();
  override placeholder = 'Search for tag';
  override readonly filterName = 'tag';

  getItemId = input((item: { id: string; name: string }) => item.id);

  constructor() {
    super();
    this.filterComponent.getItemId = this.getItemId;
    this.filterComponent.getLabelItem = this.getItemLabel;
    this.filterComponent.filterName.set(this.filterName);
    this.filterComponent.placeholder.set(this.placeholder);
  }
}
