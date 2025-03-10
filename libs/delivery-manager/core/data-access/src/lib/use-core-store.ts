import { create } from 'zustand';

type CoreState = {
  isDark: boolean;
  setTheme: () => void;
};

export const useCoreStore = create<CoreState>((set) => ({
  isDark: true,
  setTheme: () => set((state) => ({ isDark: !state.isDark })),
}));
