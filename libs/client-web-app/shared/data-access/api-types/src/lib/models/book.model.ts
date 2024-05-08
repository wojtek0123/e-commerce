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
  authors: {
    id: number;
    name: string;
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
