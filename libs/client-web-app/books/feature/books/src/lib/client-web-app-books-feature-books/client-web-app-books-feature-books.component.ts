import {
  Component,
  DestroyRef,
  OnInit,
  computed,
  inject,
  model,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BooksStore } from '@e-commerce/client-web-app/books/data-access';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import {
  BookTag,
  Category,
  allBookTags,
} from '@e-commerce/client-web-app/shared/data-access/api-types';
import { SkeletonModule } from 'primeng/skeleton';
import { SkeletonComponent } from '@e-commerce/client-web-app/books/ui/skeleton';
import { InputTextModule } from 'primeng/inputtext';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { ListboxChangeEvent, ListboxModule } from 'primeng/listbox';
import { CategoryStore } from '@e-commerce/client-web-app/shared/data-access/category';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'lib-client-web-app-books-feature-books',
  standalone: true,
  imports: [
    CardModule,
    ButtonModule,
    SkeletonModule,
    SkeletonComponent,
    InputTextModule,
    FormsModule,
    ListboxModule,
    ReactiveFormsModule,
  ],
  templateUrl: './client-web-app-books-feature-books.component.html',
  styleUrl: './client-web-app-books-feature-books.component.css',
})
export class ClientWebAppBooksFeatureBooksComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private booksStore = inject(BooksStore);
  private categoryStore = inject(CategoryStore);
  private destroyRef = inject(DestroyRef);

  books = this.booksStore.books;
  status = this.booksStore.status;
  skeletons = new Array(12);
  searchText = model<string>('');

  categories = this.categoryStore.categories;

  formGroup = new FormGroup({
    selectedCategories: new FormControl<Category[] | null>(null),
    selectedTags: new FormControl<BookTag[] | null>(null),
  });

  ngOnInit(): void {
    this.route.queryParams
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((param) => {
        const tags = param['tag'] ? [param['tag'] as BookTag] : null;
        const categoryIds = history.state['categoryIds'];

        console.log(categoryIds);
        console.log(tags);

        let selectedCategory: Category | undefined = undefined;

        if (categoryIds) {
          selectedCategory = this.categories().find(
            (c) => c.id === categoryIds[0]
          );
        }

        this.booksStore.setFilters({
          tags,
          categories: selectedCategory ? [selectedCategory] : null,
        });

        this.booksStore.filterBooks();

        this.formGroup.controls.selectedCategories.setValue(
          computed(() => this.booksStore.filters.categories())()
        );

        this.formGroup.setValue({
          selectedCategories: selectedCategory ? [selectedCategory] : null,
          selectedTags: tags,
        });
      });
  }

  filterBooks() {
    this.booksStore.filterBooks();
  }

  setTitleFilter(event: Event) {
    const value = (event.target as HTMLInputElement).value;

    this.booksStore.setFilters({ title: !value.length ? null : value });
  }

  tags = [...allBookTags];

  onChangeTagFilter(event: ListboxChangeEvent) {
    console.log(event);
    this.booksStore.setFilters({ tags: event.value });
  }

  onChangeCategoryFilter(event: ListboxChangeEvent) {
    console.log(event);
    this.booksStore.setFilters({ categories: event.value });
  }
}
