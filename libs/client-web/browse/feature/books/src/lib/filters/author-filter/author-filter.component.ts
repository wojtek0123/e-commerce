import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { AbstractFilterComponent } from '../abstract-filter.component';
import { Author } from '@e-commerce/client-web/shared/data-access';
import { selectAuthorFilter } from '@e-commerce/client-web/browse/data-access';
import { FilterComponent } from '@e-commerce/client-web/browse/ui';
import { ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'lib-author-filter',
  templateUrl: './author-filter.component.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FilterComponent, ReactiveFormsModule, InputTextModule, AsyncPipe],
})
export class AuthorFilterComponent extends AbstractFilterComponent<Author> {
  override filterName = signal('author' as const);
  override filter$ = this.store.select(selectAuthorFilter);
  override parseName = (item: Author) => item.name;
  override parseId = (item: Author) => item.id;
}
