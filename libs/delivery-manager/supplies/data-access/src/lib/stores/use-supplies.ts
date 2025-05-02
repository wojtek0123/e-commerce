import { create } from 'zustand';
import { Sort } from '@e-commerce/delivery-manager/shared/data-access';
import { SortBy } from '../models/sort-by';
import { Nullable } from 'primereact/ts-helpers';
import { Author, BookTag, Category } from '@e-commerce/shared/api-models';

export type AddInventoryForm = {
  title: string | null;
  price: number | null;
  pageCount: number | null;
  coverImage: string | null;
  language: string | null;
  pages: number | null;
  publishedDate: Nullable<Date>;
  publisherId: string | null;
  category: Category | null;
  quantity: number | null;
  tag: BookTag | null;
  authors: Author[];
};

type SuppliesState = {
  sort: Sort<SortBy>;
  page: number;
  size: number;
  addInventoryForm: AddInventoryForm;
  setSort: (by: SortBy) => void;
  setPage: (page: number) => void;
  setSize: (size: number) => void;
  modifyAddInventoryForm: (form: Partial<AddInventoryForm>) => void;
};

export const useSuppliesStore = create<SuppliesState>((set) => ({
  sort: {
    by: 'createdAt',
    mode: 'asc',
  },
  page: 1,
  size: 20,
  addInventoryForm: {
    title: '',
    price: 0,
    pageCount: 0,
    coverImage: '',
    language: '',
    pages: 0,
    publishedDate: null,
    publisherId: '',
    category: null,
    quantity: 0,
    tag: null,
    authors: [],
  },
  setSort: (by) => {
    set((state) => {
      if (state.sort.by === by) {
        return {
          sort: {
            ...state.sort,
            mode: state.sort.mode === 'desc' ? 'asc' : 'desc',
          },
        };
      } else {
        return {
          sort: { by, mode: 'desc' },
        };
      }
    });
  },
  setPage: (page) => {
    if (page < 0) return;

    set({ page });
  },
  setSize: (size) => {
    if (size < 0) return;

    set({ size });
  },
  modifyAddInventoryForm: (form) => {
    set((state) => ({
      addInventoryForm: {
        ...state.addInventoryForm,
        ...form,
      },
    }));
  },
}));
