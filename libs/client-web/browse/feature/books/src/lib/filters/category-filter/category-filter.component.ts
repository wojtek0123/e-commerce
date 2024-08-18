import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { AbstractFilterComponent } from '../abstract-filter.component';
import { Category } from '@e-commerce/client-web/shared/data-access';
import { selectCategoryFilter } from '@e-commerce/client-web/browse/data-access';
import { FilterComponent } from '@e-commerce/client-web/browse/ui';
import { ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'lib-category-filter',
  templateUrl: './category-filter.component.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FilterComponent, ReactiveFormsModule, InputTextModule, AsyncPipe],
})
export class CategoryFilterComponent extends AbstractFilterComponent<Category> {
  override filterName = signal('category' as const);
  override filter$ = this.store.select(selectCategoryFilter);
  override parseName = (item: Category) => item.name;
  override parseId = (item: Category) => item.id;
}
