import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  OnInit,
  inject,
  output,
  signal,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  BooksFilters,
  BooksService,
} from '@e-commerce/client-web-app/browse/data-access';
import {
  BookTag,
  allBookTags,
} from '@e-commerce/client-web-app/shared/data-access/api-types';
import { map } from 'rxjs';
import { FilterAccordionTabComponent } from '../filter-accordion/filter-accordion.component';
import { AsyncPipe } from '@angular/common';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CheckboxModule } from 'primeng/checkbox';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'lib-tags-filter',
  template: `
    <lib-filter-accordion-tab
      filterName="tags"
      header="Categories"
      [selectedItemsCount]="selectedItemsControl.value.length"
      (clearEvent)="clearFilterEvent.emit($event)"
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
              [formControl]="selectedItemsControl"
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
    ReactiveFormsModule,
    CheckboxModule,
    InputTextModule,
  ],
})
export class TagsFilterComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private booksService = inject(BooksService);
  private destroyRef = inject(DestroyRef);

  tags = signal<BookTag[]>([...allBookTags]);
  searchText = signal<string | null>(null);
  selectedItemsControl = new FormControl<string[]>([], { nonNullable: true });
  clearFilterEvent = output<keyof BooksFilters>();

  ngOnInit(): void {
    this.route.queryParams
      .pipe(
        map((queryParams) => queryParams['tags'] as string | undefined),
        map((filter) => filter?.replaceAll('_', ' ').split(',') ?? []),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((tags) => {
        this.selectedItemsControl.setValue(tags);
        this.booksService.setTags(tags as BookTag[]);
      });

    this.selectedItemsControl.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((tags) => {
        this.router.navigate([], {
          relativeTo: this.route,
          queryParams: {
            authors:
              tags?.map((name) => name.replaceAll(' ', '_'))?.join(',') || null,
          },
          queryParamsHandling: 'merge',
          replaceUrl: true,
        });
      });
  }
}
