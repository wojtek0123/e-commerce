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
}

export enum BookTag {
  BESTSELLER = 'BESTSELLER',
  NOWE = 'NOWE',
  NADCHODZACE = 'NADCHODZACE',
  PROMOCJE = 'PROMOCJE',
}

export const allBookTags = [
  { name: BookTag.BESTSELLER.toLowerCase(), value: BookTag.BESTSELLER },
  { name: BookTag.NOWE.toLowerCase(), value: BookTag.NOWE },
  { name: BookTag.NADCHODZACE.toLowerCase(), value: BookTag.NADCHODZACE },
  { name: BookTag.PROMOCJE.toLowerCase(), value: BookTag.PROMOCJE },
];
