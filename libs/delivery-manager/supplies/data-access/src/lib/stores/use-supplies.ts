import { create } from 'zustand';
import { Sort } from '@e-commerce/delivery-manager/shared/data-access';
import { SortBy } from '../models/sort-by';

type SuppliesState = {
  sort: Sort<SortBy>;
  page: number;
  size: number;
  setSort: (by: SortBy) => void;
  setPage: (page: number) => void;
  setSize: (size: number) => void;
};

export const useSuppliesStore = create<SuppliesState>((set) => ({
  sort: {
    by: 'title',
    mode: 'asc',
  },
  page: 1,
  size: 20,
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
}));
