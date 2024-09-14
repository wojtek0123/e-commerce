import { Author } from './author.model';
import { Category } from './category.model';
import { ProductInventory } from './product-inventory.model';

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

export interface BookDetails extends Book {
  productInventory: ProductInventory;
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
