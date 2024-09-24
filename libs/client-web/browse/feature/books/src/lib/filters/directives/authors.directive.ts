import { Directive, inject } from '@angular/core';
import { selectSelectedAuthors } from '@e-commerce/client-web/browse/data-access';
import {
  Author,
  AuthorApiService,
} from '@e-commerce/client-web/shared/data-access';
import {
  AbstractSelectItemsFilterDirective,
  PAGE,
  SIZE,
} from './select-item-filter.directive';

@Directive({
  selector: 'lib-filter[libAuthors]',
  standalone: true,
})
export class AuthorsDirective extends AbstractSelectItemsFilterDirective<Author> {
  private authorApi = inject(AuthorApiService);

  override getItems$ = (search: string) =>
    this.authorApi.getAll$({ nameLike: search, page: PAGE, size: SIZE });
  override selectedItems$ = this.store.select(selectSelectedAuthors);
  override trackFn = (_: number, item: Author) => item.id;
  override getItemLabel = (item: Author) => item.name;
  override placeholder = 'Search for author';
  override readonly filterName = 'author';
}
