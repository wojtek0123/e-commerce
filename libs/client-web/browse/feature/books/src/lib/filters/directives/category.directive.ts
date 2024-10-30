import { Directive, input } from '@angular/core';
import { Category } from '@e-commerce/client-web/shared/data-access/api-models';
import { AbstractSelectItemsFilterDirective } from './select-item-filter.directive';

@Directive({
  selector: 'lib-filter[libCategories]',
  standalone: true,
})
export class CategoriesDirective extends AbstractSelectItemsFilterDirective<Category> {
  override triggerGetItems = (search: string) =>
    this.booksStore.getCategories({ search });
  override selectedItems = this.booksStore.selectedCategories;
  override items = this.booksStore.filters.category.items;
  override trackFn = (_: number, item: Category) => item.id;
  override getItemLabel = (item: Category) => item.name;
  override placeholder = 'Search for category';
  override readonly filterName = 'category';

  getItemId = input((item: Category) => item.id);

  constructor() {
    super();
    // this.filterComponent.trackFn = this.trackFn;
    this.filterComponent.getItemId = this.getItemId;
    this.filterComponent.getLabelItem = this.getItemLabel;
    this.filterComponent.filterName.set(this.filterName);
    this.filterComponent.placeholder.set(this.placeholder);
  }
}
