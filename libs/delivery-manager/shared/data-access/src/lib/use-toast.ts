import { create } from 'zustand';
import { ToastMessage } from 'primereact/toast';

type ToastState = {
  toastMessage: ToastMessage | null;
  show: (toastMessage: ToastMessage) => void;
};

export const useToastStore = create<ToastState>((set) => ({
  toastMessage: null,
  show: (toastMessage) => {
    if (!toastMessage.id) {
      toastMessage = { ...toastMessage, id: crypto.randomUUID() };
    }

    set({ toastMessage: toastMessage });

    setTimeout(() => {
      set({ toastMessage: null });
    }, toastMessage.life || 5000);
  },
}));
