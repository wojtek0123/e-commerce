import { Component, computed, inject, input, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HomeStore, HomeState } from '@e-commerce/client-web/home/data-acess';
import { BookTag } from '@e-commerce/client-web/shared/data-access';
import { BooksGridComponent } from '@e-commerce/client-web/shared/ui';

@Component({
  selector: 'lib-books-section',
  standalone: true,
  imports: [BooksGridComponent, RouterLink],
  templateUrl: './books-section.component.html',
  styleUrl: './books-section.component.scss',
})
export class BooksSectionComponent implements OnInit {
  private store = inject(HomeStore);

  tag = input.required<keyof HomeState>();
  bookTag = input.required<BookTag>();

  public books = computed(() => this.store[this.tag()].books());
  public loading = computed(() => this.store[this.tag()].loading());
  public error = computed(() => this.store[this.tag()].error());

  ngOnInit(): void {
    this.store.getBooks([this.tag(), this.bookTag()]);
  }
}
