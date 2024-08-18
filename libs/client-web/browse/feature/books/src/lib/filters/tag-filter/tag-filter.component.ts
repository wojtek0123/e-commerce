import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { AbstractFilterComponent } from '../abstract-filter.component';
import { AsyncPipe } from '@angular/common';
import { BookTag } from '@e-commerce/client-web/shared/data-access';
import { selectTagFilter } from '@e-commerce/client-web/browse/data-access';
import { FilterComponent } from '@e-commerce/client-web/browse/ui';
import { ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'lib-tag-filter',
  standalone: true,
  imports: [AsyncPipe, FilterComponent, ReactiveFormsModule, InputTextModule],
  templateUrl: './tag-filter.component.html',
  styleUrl: './tag-filter.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TagFilterComponent extends AbstractFilterComponent<BookTag> {
  override filter$ = this.store.select(selectTagFilter);
  override filterName = signal('tag' as const);
  override parseId = (tag: BookTag) => tag;
  override parseName = (tag: BookTag) => tag;
}
