import { create } from 'zustand';

type SuppliesState = {
  id: string;
};

export const useSuppliesStore = create<SuppliesState>((set) => ({
  id: '',
}));
