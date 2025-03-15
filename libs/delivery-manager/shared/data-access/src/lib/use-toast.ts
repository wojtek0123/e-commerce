import { create } from 'zustand';

type ToastState = {
  hidden: boolean;
  message: string | null;
  show: (message: string) => void;
};

export const useToastStore = create<ToastState>((set) => ({
  hidden: true,
  message: null,
  show: (message: string) => {
    set({ hidden: false, message });

    setTimeout(() => {
      set({ hidden: true, message: null });
    }, 5000);
  },
}));
