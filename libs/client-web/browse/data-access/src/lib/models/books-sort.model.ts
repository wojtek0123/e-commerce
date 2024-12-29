export interface BooksSort {
  key: BooksSortKey;
  direction: BooksSortDirection;
}

export type BooksSortKey = 'title' | 'price' | 'publishedDate';
export type BooksSortDirection = 'asc' | 'desc';
