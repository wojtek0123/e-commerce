import {
  ChangeDetectionStrategy,
  Component,
  computed,
  signal,
} from '@angular/core';
import { allBookTags } from '@e-commerce/client-web-app/shared/data-access/api-types';
import { FilterAccordionTabComponent } from '../filter-accordion/filter-accordion.component';
import { AsyncPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { appRouterConfig } from '@e-commerce/client-web-app/shared/utils/router-config';
import { AbstractBookFilterComponent } from '@e-commerce/client-web-app/browse/data-access';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'lib-tags-filter',
  template: `
    <lib-filter-accordion-tab
      filterName="tags"
      header="Tags"
      [selectedItemsCount]="selectedNames().length"
      (clearEvent)="clearChecked()"
    >
      <div class="flex flex-column gap-2">
        <input
          placeholder="Search for tags..."
          pInputText
          [(ngModel)]="searchText"
          class="w-full"
        />
        <div class="flex flex-column gap-2">
          @for (name of tags(); track name) {
            <p-checkbox
              [(ngModel)]="selectedNames"
              (onChange)="onChange($event)"
              [label]="name"
              [value]="name"
            />
          } @empty {
            <div>Not found more tags</div>
          }
        </div>
      </div>
    </lib-filter-accordion-tab>
  `,
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    FilterAccordionTabComponent,
    AsyncPipe,
    FormsModule,
    CheckboxModule,
    InputTextModule,
  ],
})
export class TagsFilterComponent extends AbstractBookFilterComponent {
  allTags = signal([
    ...allBookTags.map((tag) => tag.toLowerCase()),
  ]).asReadonly();
  tags = computed(() =>
    this.searchText()?.length
      ? this.allTags().filter((t) => t.includes(this.searchText() ?? ''))
      : this.allTags(),
  );
  override names$: Observable<string[]> = of([]);
  override error$: Observable<string | null> = of(null);

  override queryParamKey: string = appRouterConfig.queryParams.tags;
}
