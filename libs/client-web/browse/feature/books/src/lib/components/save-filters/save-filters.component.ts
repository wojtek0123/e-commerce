import { KeyValuePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  ActiveFilter,
  BooksStore,
} from '@e-commerce/client-web/browse/data-access';
import { DisplayActiveFiltersComponent } from '@e-commerce/client-web/browse/ui';
import {
  FormFieldComponent,
  LabelComponent,
} from '@e-commerce/client-web/shared/ui';
import { ErrorMessageDirective } from '@e-commerce/client-web/shared/utils';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { Divider } from 'primeng/divider';
import { InputText } from 'primeng/inputtext';
import { Message } from 'primeng/message';
import { groupBy } from '@e-commerce/client-web/browse/utils';

@Component({
  selector: 'lib-save-filters',
  templateUrl: './save-filters.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ButtonModule,
    DialogModule,
    InputText,
    LabelComponent,
    Message,
    FormFieldComponent,
    ErrorMessageDirective,
    ReactiveFormsModule,
    KeyValuePipe,
    Divider,
    DisplayActiveFiltersComponent,
  ],
})
export class SaveFiltersComponent {
  #booksStore = inject(BooksStore);

  visible = signal(false);

  filters = this.#booksStore.activeFilters;

  groupedFiltersByFilter = computed(() =>
    groupBy(
      this.filters(),
      (activeFilter: ActiveFilter) => activeFilter.filter,
    ),
  );

  nameFc = new FormControl<string | null>(null, Validators.required);

  open() {
    this.nameFc.reset();
    this.visible.set(true);
  }

  cancel() {
    this.visible.set(false);
  }

  save() {
    const name = this.nameFc.value;

    if (this.nameFc.pristine) {
      this.nameFc.markAsDirty();
    }

    if (this.nameFc.invalid || !name) return;

    const filters = new Map(
      JSON.parse(localStorage.getItem('filters') || '[]'),
    );

    filters.set(name, this.filters());

    localStorage.setItem('filters', JSON.stringify([...filters]));

    this.visible.set(false);
  }
}
