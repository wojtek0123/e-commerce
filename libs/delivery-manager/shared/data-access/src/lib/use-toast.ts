import { create } from 'zustand';

type ToastVariant = 'success' | 'error';

type ToastState = {
  hidden: boolean;
  message: string | null;
  variant: ToastVariant;
  show: (message: string, variant: ToastVariant) => void;
};

export const useToastStore = create<ToastState>((set) => ({
  hidden: true,
  message: null,
  variant: 'success',
  show: (message, variant) => {
    set({ hidden: false, message, variant });

    setTimeout(() => {
      set({ hidden: true, message: null });
    }, 5000);
  },
}));
