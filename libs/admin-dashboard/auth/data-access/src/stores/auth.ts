import { defineStore } from 'pinia';
import { useToast } from 'primevue/usetoast';
import { computed, ref } from 'vue';
import axios, { AxiosError } from 'axios';
import { Tokens, User } from '@e-commerce/shared/api-models';
import { useRouter } from 'vue-router';
import { Role } from '@prisma/client';

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

    tokens.value = {
      access: session.accessToken,
      refresh: session.refreshToken,
    };
    if (session.userId) userId.value = session.userId;
  }

  function removeSessionFromStorage() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userId');

    tokens.value = {
      access: null,
      refresh: null,
    };
    userId.value = null;
  }

  async function login(body: { email: string; password: string }) {
    loading.value = true;
    try {
      const { data } = await axios.post<{ tokens: Tokens; user: User }>(
        `${import.meta.env.VITE_API_URL}/auth/login`,
        body,
      );

      if (data.user.role !== Role.ADMIN) {
        throw new Error('Unauthorized Exception');
      }

      userId.value = data.user.id;
      tokens.value = {
        access: data.tokens.accessToken,
        refresh: data.tokens.refreshToken,
      };

      toast.add({
        summary: 'Success',
        detail: 'You are logged in',
        severity: 'success',
        life: 5000,
      });

      setSessionToStorage({ ...data.tokens, userId: data.user.id });
      await router.push({ name: 'book-list' });
    } catch (e: unknown) {
      console.log(e);
      if (e instanceof AxiosError) {
        error.value =
          e.response?.data?.message ?? 'An error occurred while logging in';
      }
      toast.add({
        summary: 'Error',
        detail: error.value ?? 'An error occurred while logging in',
        severity: 'error',
        life: 5000,
      });
    } finally {
      loading.value = false;
    }
  }

  async function getNewTokens() {
    loading.value = true;
    const body = { userId: userId.value, refreshToken: tokens.value.refresh };
    try {
      const { data } = await axios.post<{
        accessToken: Tokens['accessToken'];
        refreshToken: Tokens['refreshToken'];
      }>(`${import.meta.env.VITE_API_URL}/auth/refresh`, body);

      tokens.value = {
        access: data.accessToken,
        refresh: data.refreshToken,
      };

      toast.add({
        severity: 'success',
        detail: 'You have been registered',
        summary: 'Success',
        life: 5000,
      });
      setSessionToStorage({
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
      });
    } catch (e: unknown) {
      if (e instanceof AxiosError) {
        error.value = e.response?.data?.message ?? 'Error occurred';
      }

      console.log('here', e);

      logout();
      removeSessionFromStorage();

      toast.add({
        summary: 'Error',
        detail: error.value ?? 'An error occurred',
        severity: 'error',
        life: 5000,
      });
    } finally {
      loading.value = false;
    }
  }

  async function logout() {
    loading.value = true;
    try {
      await axios.post<{ user: User }>(
        `${import.meta.env.VITE_API_URL}/auth/logout`,
        { id: userId.value },
      );

      toast.add({
        severity: 'success',
        detail: 'You have been logged out',
        summary: 'Success',
        life: 5000,
      });
      removeSessionFromStorage();
      await router.push('/auth/login');
    } catch (e: unknown) {
      if (e instanceof AxiosError) {
        error.value =
          e.response?.data?.message ?? 'An error occurred while logging out';
      }
      toast.add({
        summary: 'Error',
        detail: error.value ?? 'An error occurred while logging out',
        severity: 'error',
        life: 5000,
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
    getNewTokens,
    logout,
    getSessionFromStorage,
    isAuthenticated,
    setSessionToStorage,
  };
});
