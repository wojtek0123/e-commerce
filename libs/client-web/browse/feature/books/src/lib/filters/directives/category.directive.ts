import { Directive, inject } from '@angular/core';
import { selectSelectedCategories } from '@e-commerce/client-web/browse/data-access';
import {
  Category,
  CategoryApiService,
} from '@e-commerce/client-web/shared/data-access';
import {
  AbstractSelectItemsFilterDirective,
  PAGE,
  SIZE,
} from './select-item-filter.directive';

@Directive({
  selector: 'lib-filter[libCategories]',
  standalone: true,
})
export class CategoriesDirective extends AbstractSelectItemsFilterDirective<Category> {
  private categoryApi = inject(CategoryApiService);

  override getItems$ = (search: string) =>
    this.categoryApi.getCategories$({
      nameLike: search,
      page: PAGE,
      size: SIZE,
    });
  override selectedItems$ = this.store.select(selectSelectedCategories);
  override trackFn = (_: number, item: Category) => item.id;
  override getItemLabel = (item: Category) => item.name;
  override placeholder = 'Search for category';
  override readonly filterName = 'category';
}
