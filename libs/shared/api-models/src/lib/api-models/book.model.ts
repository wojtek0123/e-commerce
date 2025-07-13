import { Author } from './author.model';
import { BookReview } from './book-review.model';
import { Category } from './category.model';
import { Inventory } from './inventory.model';
import { Publisher } from './publisher.model';

export interface Book {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  description?: string;
  publishedDate?: string;
  pages?: number;
  categoryId: Category['id'];
  coverImage?: string;
  language?: string;
  tag?: BookTag;
  price: number;
  publisher: Publisher;
  inventory: {
    quantity: number;
  };
  authors: Author[];
  category: Category;
  reviews: BookReview[];
}

export interface BookDetails extends Book {
  inventory: Inventory;
}

export enum BookTag {
  BESTSELLER = 'BESTSELLER',
  NEW = 'NEW',
  INCOMING = 'INCOMING',
  DISCOUNT = 'DISCOUNT',
  PREMIERE_OF_THE_MONTH = 'PREMIERE_OF_THE_MONTH ',
}

export const allBookTags = [
  BookTag.BESTSELLER,
  BookTag.NEW,
  BookTag.INCOMING,
  BookTag.DISCOUNT,
];
