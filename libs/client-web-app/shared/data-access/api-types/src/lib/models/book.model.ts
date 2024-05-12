import { Author } from './author.model';
import { Category } from './category.model';

export interface Book {
  id: number;
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
  authors: Author[];
  category: Category;
}

export enum BookTag {
  BESTSELLER = 'BESTSELLER',
  NEW = 'NEW',
  INCOMING = 'INCOMING',
  DISCOUNT = 'DISCOUNT',
}

export const allBookTags = [
  BookTag.BESTSELLER,
  BookTag.NEW,
  BookTag.INCOMING,
  BookTag.DISCOUNT,
];
