import { create } from 'zustand';
import { Tokens, User } from '@e-commerce/shared/api-models';
import { useEffect } from 'react';

type AuthStore = {
  userId: User['id'] | null;
  tokens: {
    access: string | null;
    refresh: string | null;
  };
  loading: boolean;
  error: string | null;
  authenticate: (user: User, tokens: Tokens) => void;
  retrieveSession: () => void;
  saveSessionToStorage: (tokens: Tokens) => void;
  logout: () => void;
};

export const useAuthStore = create<AuthStore>((set) => ({
  userId: null,
  tokens: {
    access: null,
    refresh: null,
  },
  loading: false,
  error: null,
  authenticate: (user, { accessToken, refreshToken }) => {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    localStorage.setItem('userId', user.id);

    set({
      userId: user.id,
      tokens: { access: accessToken, refresh: refreshToken },
    });
  },
  retrieveSession: () => {
    const accessToken = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');
    const userId = localStorage.getItem('userId');

    console.log(userId, accessToken, refreshToken);

    set({ userId, tokens: { access: accessToken, refresh: refreshToken } });
  },
  logout: () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userId');

    set({ userId: null, tokens: { access: null, refresh: null } });
  },
  saveSessionToStorage: ({ accessToken, refreshToken }: Tokens) => {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);

    set({ tokens: { access: accessToken, refresh: refreshToken } });
  },
}));
