import { create } from 'zustand';
import { Tokens, User } from '@e-commerce/shared/api-models';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

type AuthStore = {
  user: User | null;
  tokens: {
    access: string | null;
    refresh: string | null;
  };
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
};

function getSessionFromStorage(tokens: Tokens) {
  const access = localStorage.getItem('accessToken');
  const refresh = localStorage.getItem('refreshToken');
  const id = localStorage.getItem('userId');

  return { id, tokens: { access, refresh } };
}

function setSessionToStorage(session: {
  accessToken: Tokens['accessToken'];
  refreshToken: Tokens['refreshToken'];
  userId?: User['id'];
}) {
  localStorage.setItem('accessToken', session.accessToken);
  localStorage.setItem('refreshToken', session.refreshToken);
  if (session.userId) localStorage.setItem('userId', session.userId);
}

function removeSessionFromStorage() {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('userId');
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  tokens: {
    access: null,
    refresh: null,
  },
  loading: false,
  error: null,
  login: async (email: string, password: string) => {
    try {
      set({ loading: true });

      const {
        data: {
          user,
          tokens: { accessToken, refreshToken },
        },
      } = await axios.post<{ user: User; tokens: Tokens }>(
        'http://localhost:3000/auth/login',
        { email, password },
      );

      set({
        user,
        tokens: {
          access: accessToken,
          refresh: refreshToken,
        },
        loading: false,
        error: null,
      });

      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('userId', user.id);
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
  logout: async (userId: User['id']) => {
    set({ loading: true });

    try {
      await axios.post<{ user: User }>(
        `${import.meta.env.VITE_API_URL}/auth/logout`,
        { id: userId },
      );

      // toast.add({
      //   severity: 'success',
      //   detail: 'You have been logged out',
      //   summary: 'Success',
      //   life: 5000,
      // });
      removeSessionFromStorage();
      // await router.push('/auth/login');
    } catch (e: unknown) {
      // if (e instanceof AxiosError) {
      //   error.value =
      //     e.response?.data?.message ?? 'An error occurred while logging out';
      // }
      // toast.add({
      //   summary: 'Error',
      //   detail: error.value ?? 'An error occurred while logging out',
      //   severity: 'error',
      //   life: 5000,
      // });
    } finally {
      set({ loading: false });
    }
  },
}));
