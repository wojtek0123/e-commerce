import { create } from 'zustand';

type CoreState = {
  isDark: boolean;
  setTheme: (isDark: boolean) => void;
};

export const useCoreStore = create<CoreState>((set) => ({
  isDark: true,
  setTheme: (isDark: boolean) => {
    set((state) => ({ isDark }));
  },
}));
