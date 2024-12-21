import { defineStore } from 'pinia';
import { useToast } from 'primevue/usetoast';
import { computed, ref } from 'vue';
import axios, { AxiosError } from 'axios';
import { Tokens, User } from '@e-commerce/shared/api-models';
import { useRouter } from 'vue-router';

export const useAuthStore = defineStore('auth', () => {
  const router = useRouter();
  const toast = useToast();

  const loading = ref(false);
  const error = ref<string | null>(null);

  const tokens = ref<{ access: string | null; refresh: string | null }>({
    access: null,
    refresh: null,
  });
  const userId = ref<string | null>(null);
  const isAuthenticated = computed(
    () => tokens.value.access && tokens.value.refresh && userId,
  );

  function getSessionFromStorage() {
    const accessToken = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');
    const id = localStorage.getItem('userId');

    tokens.value = {
      access: accessToken,
      refresh: refreshToken,
    };
    userId.value = id;
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

  async function login(body: { email: string; password: string }) {
    loading.value = true;
    try {
      const { data } = await axios.post<{ tokens: Tokens; user: User }>(
        `${import.meta.env.VITE_API_URL}/auth/login`,
        body,
      );

      userId.value = data.user.id;
      tokens.value = {
        access: data.tokens.accessToken,
        refresh: data.tokens.refreshToken,
      };

      toast.add({
        detail: 'Success',
        summary: 'You are logged in',
        severity: 'success',
      });

      setSessionToStorage({ ...data.tokens, userId: data.user.id });
      await router.push({ name: 'books' });
    } catch (e: unknown) {
      if (e instanceof AxiosError) {
        error.value =
          e.response?.data?.message ?? 'An error occurred while logging in';
      }
      toast.add({
        detail: 'Error',
        summary: error.value ?? 'An error occurred while logging in',
        severity: 'error',
      });
    } finally {
      loading.value = false;
    }
  }

  async function register() {
    loading.value = true;
    try {
      const { data } = await axios.get<{ tokens: Tokens; user: User }>(
        `${import.meta.env.VITE_API_URL}/auth/register`,
      );

      userId.value = data.user.id;
      tokens.value = {
        access: data.tokens.accessToken,
        refresh: data.tokens.refreshToken,
      };
      toast.add({
        severity: 'success',
        detail: 'You have been logged in',
        summary: 'Success',
      });

      setSessionToStorage({ ...data.tokens, userId: data.user.id });
      await router.push({ name: 'books' });
    } catch (e: unknown) {
      if (e instanceof AxiosError) {
        error.value =
          e.response?.data?.message ?? 'An error occurred while logging in';
      }
      toast.add({
        detail: 'Error',
        summary: error.value ?? 'An error occurred while logging in',
        severity: 'error',
      });
    } finally {
      loading.value = false;
    }
  }

  async function getNewTokens() {
    loading.value = true;
    try {
      const { data } = await axios.get<{ tokens: Tokens }>(
        `${import.meta.env.VITE_API_URL}/auth/refresh`,
      );

      tokens.value = {
        access: data.tokens.accessToken,
        refresh: data.tokens.refreshToken,
      };

      toast.add({
        severity: 'success',
        detail: 'You have been registered',
        summary: 'Success',
      });
      setSessionToStorage({
        accessToken: data.tokens.accessToken,
        refreshToken: data.tokens.refreshToken,
      });
    } catch (e: unknown) {
      if (e instanceof AxiosError) {
        error.value =
          e.response?.data?.message ?? 'An error occurred while logging in';
      }
      toast.add({
        detail: 'Error',
        summary: error.value ?? 'An error occurred while logging in',
        severity: 'error',
      });
    } finally {
      loading.value = false;
    }
  }

  async function logout() {
    loading.value = true;
    try {
      const { data } = await axios.get<{ user: User }>(
        `${import.meta.env.VITE_API_URL}/auth/logout`,
      );

      userId.value = data.user.id;
      tokens.value = {
        access: null,
        refresh: null,
      };
      toast.add({
        severity: 'success',
        detail: 'You have been logged out',
        summary: 'Success',
      });
      removeSessionFromStorage();
    } catch (e: unknown) {
      if (e instanceof AxiosError) {
        error.value =
          e.response?.data?.message ?? 'An error occurred while logging in';
      }
      toast.add({
        detail: 'Error',
        summary: error.value ?? 'An error occurred while logging in',
        severity: 'error',
      });
    } finally {
      loading.value = false;
    }
  }

  return {
    loading,
    tokens,
    userId,
    login,
    register,
    getNewTokens,
    logout,
    getSessionFromStorage,
    isAuthenticated,
  };
});
