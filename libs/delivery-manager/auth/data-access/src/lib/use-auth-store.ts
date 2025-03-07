import { create } from 'zustand';
import { User } from '@e-commerce/shared/api-models';
import axios from 'axios';

type AuthStore = {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
};

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  loading: false,
  error: null,
  login: async () => {
    try {
      set({ loading: true });

      const response = await axios.post<User>(
        'http://localhost:3000/auth/login',
        { email: '', password: '' },
      );

      set({ user: response.data, loading: false, error: null });
    } catch (error) {
      set({ user: null, loading: false });

      if (axios.isAxiosError(error)) {
        if (error.response) {
          set({
            error: error.response.data?.message || 'Server error occurred',
          });
        } else if (error.request) {
          set({ error: 'No response from server' });
        } else {
          set({ error: error.message });
        }
      } else if (error instanceof Error) {
        set({ error: error.message });
      } else {
        set({ error: 'An unexpected error occurred' });
      }
    }
  },
}));
