import { defineStore } from 'pinia';
import { useToast } from 'primevue/usetoast';
import { ref } from 'vue';
import axios, { AxiosError } from 'axios';
import { Tokens, User } from '@e-commerce/shared/api-models';

export const useAuthStore = defineStore('auth', () => {
  const toast = useToast();

  const loading = ref(false);
  const error = ref<string | null>(null);

  const tokens = ref<{ access: string | null; refresh: string | null }>({
    access: null,
    refresh: null,
  });
  const userId = ref<string | null>(null);

  async function login() {
    loading.value = true;
    try {
      const { data } = await axios.get<{ tokens: Tokens; user: User }>(
        `${import.meta.env.VITE_API_URL}/auth/login`,
      );

      userId.value = data.user.id;
      tokens.value = {
        access: data.tokens.accessToken,
        refresh: data.tokens.refreshToken,
      };

      toast.add({
        detail: 'Success',
        summary: '',
        severity: 'success',
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

  return { loading, tokens, userId, login, register, getNewTokens, logout };
});
