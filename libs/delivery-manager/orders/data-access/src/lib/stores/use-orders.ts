import { create } from 'zustand';
import { Sort, SortBy } from '../models/sort.model';

type OrdersState = {
  sort: Sort;
  setSort: (by: SortBy) => void;
};

export const useOrdersStore = create<OrdersState>((set) => ({
  sort: {
    by: 'createdAt',
    mode: 'desc',
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
}));
