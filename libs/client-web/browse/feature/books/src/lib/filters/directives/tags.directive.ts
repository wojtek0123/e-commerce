import { Directive, inject, Injector, signal } from '@angular/core';
import { selectSelectedTags } from '@e-commerce/client-web/browse/data-access';
import {
  BookTag,
  allBookTags,
} from '@e-commerce/client-web/shared/data-access';
import {
  AbstractSelectItemsFilterDirective,
  SIZE,
} from './select-item-filter.directive';
import { toObservable } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';

@Directive({
  selector: 'lib-filter[libTags]',
  standalone: true,
})
export class TagsDirective extends AbstractSelectItemsFilterDirective<BookTag> {
  private allTags = signal([...allBookTags]);
  private injector = inject(Injector);

  override getItems$ = (search: string) =>
    toObservable(this.allTags, { injector: this.injector }).pipe(
      map((tags) =>
        tags
          .filter((tag) =>
            tag.toLowerCase().includes(search.toLowerCase() ?? ''),
          )
          .slice(0, SIZE),
      ),
    );
  override selectedItems$ = this.store.select(selectSelectedTags);
  override trackFn = (_: number, item: BookTag) => item;
  override getItemLabel = (item: BookTag) => item;
  override placeholder = 'Search for tag';
  override readonly filterName = 'tag';
}
