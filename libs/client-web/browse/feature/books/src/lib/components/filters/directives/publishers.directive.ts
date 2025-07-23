import { Directive, input } from '@angular/core';
import { Publisher } from '@e-commerce/shared/api-models';
import { AbstractSelectItemsFilterDirective } from './select-item-filter.directive';

@Directive({
  selector: 'lib-filter[libPublishers]',
  standalone: true,
})
export class PublishersDirective extends AbstractSelectItemsFilterDirective<Publisher> {
  override triggerGetItems = (search: string) =>
    this.booksStore.getPublishers({ search });
  override selectedItems = this.booksStore.selectedPublishers;
  override trackFn = (_: number, item: Publisher) => item.id;
  override getItemLabel = (item: Publisher) => item.name;
  override placeholder = 'Search for publisher';
  override readonly filterName = 'publisher';
  override items = this.booksStore.filters.multiSelect.publisher.items;

  getItemId = input((item: Publisher) => item.id);

  constructor() {
    super();
    this.filterComponent.getItemId = this.getItemId;
    this.filterComponent.getLabelItem = this.getItemLabel;
    this.filterComponent.filterName.set(this.filterName);
    this.filterComponent.placeholder.set(this.placeholder);
  }
}
