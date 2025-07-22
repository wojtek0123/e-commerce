import { DatePipe, NgOptimizedImage } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  effect,
  inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { BookStore } from '@e-commerce/client-web/browse/data-access';
import { DetailRowComponent } from '@e-commerce/client-web/browse/ui';
import { Breadcrumb } from 'primeng/breadcrumb';
import { Tag } from 'primeng/tag';
import { PriceSectionComponent } from '../price-section/price-section.component';
import { MenuItem } from 'primeng/api';
import { APP_ROUTE_PATHS_TOKEN } from '@e-commerce/client-web/shared/app-config';
import { SectionHeaderDirective } from '../../directives/section-header.directive';
import { BookTagToSeverityPipe } from '@e-commerce/client-web/shared/utils';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { defaultDescription } from '@e-commerce/client-web/shared/utils';

@Component({
  selector: 'lib-book-details',
  imports: [
    Breadcrumb,
    DetailRowComponent,
    NgOptimizedImage,
    Tag,
    DatePipe,
    PriceSectionComponent,
    SectionHeaderDirective,
    BookTagToSeverityPipe,
  ],
  templateUrl: './book-details.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'flex flex-col gap-base' },
})
export class BookDetailsComponent implements OnInit, OnDestroy {
  #bookStore = inject(BookStore);
  #appRoutePaths = inject(APP_ROUTE_PATHS_TOKEN);
  #title = inject(Title);
  #meta = inject(Meta);
  #route = inject(ActivatedRoute);
  #destroyRef = inject(DestroyRef);

  book = this.#bookStore.book;

  breadcrumbs = computed<MenuItem[]>(() => [
    { label: 'Home', routerLink: '/' },
    {
      label: 'books',
      routerLink: this.#appRoutePaths.BOOKS(),
    },
    {
      label: this.book()?.title,
      routerLink: this.#appRoutePaths.BOOK(this.book()?.id),
    },
  ]);

  constructor() {
    effect(() => {
      const bookTitle = this.book()?.title;
      const description = this.book()?.description;

      if (!bookTitle || !description) return;

      this.#title.setTitle(`${bookTitle} | StoryStash`);
      this.#meta.updateTag({ name: 'description', content: description });
    });
  }

  ngOnInit(): void {
    this.#route.paramMap
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe(() => {
        const bookTitle = this.book()?.title;
        this.#title.setTitle(
          `${bookTitle ? bookTitle + ' | StoryStash' : 'StoryStash'}`,
        );
        this.#meta.updateTag({
          name: 'description',
          content: this.book()?.description ?? '',
        });
      });
  }

  ngOnDestroy(): void {
    this.#meta.updateTag({
      name: 'description',
      content: defaultDescription,
    });
  }
}
