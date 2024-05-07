import { Category } from './category.model';

export interface Book {
  id: number;
  title: string;
  createdAt: string;
  updatedAt: string;
  description?: string;
  publishingDate?: string;
  numberPages?: number;
  categoryId: Category['id'];
  coverImage?: string;
  language?: string;
  tag?: BookTag;
  price: number;
  authors: {
    bookId: Book['id'];
    authorId: number;
    createdAt: string;
    updatedAt: string;
    author: {
      id: number;
      name: string;
    };
  }[];
}

export enum BookTag {
  BESTSELLER = 'BESTSELLER',
  NOWE = 'NOWE',
  NADCHODZACE = 'NADCHODZACE',
  PROMOCJE = 'PROMOCJE',
}

export const allBookTags = [
  BookTag.BESTSELLER,
  BookTag.NOWE,
  BookTag.NADCHODZACE,
  BookTag.PROMOCJE,
];
