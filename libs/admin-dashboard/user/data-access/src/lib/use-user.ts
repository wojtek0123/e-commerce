import { defineStore } from 'pinia';
import { ref } from 'vue';
import { Role, User } from '@e-commerce/shared/api-models';
import axios, { AxiosError } from 'axios';

export const useUserStore = defineStore('user', () => {
  const users = ref<User[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);
  const selectedUsers = ref<User[]>([]);

  async function getUsers() {
    loading.value = true;
    users.value = [];
    error.value = null;

    try {
      const response = await axios.get<User[]>(
        `${import.meta.env.VITE_API_URL}/users`,
      );
      users.value = response.data;
    } catch (e: unknown) {
      if (e instanceof AxiosError) {
        error.value =
          e.response?.data?.message ?? 'Error occurred while fetching books';
      } else {
        error.value = 'An unexpected error occurred';
      }
    } finally {
      loading.value = false;
    }
  }

  async function addUser(params: {
    email: string;
    password: string;
    role?: Role;
  }) {
    loading.value = true;
    error.value = null;

    try {
      const response = await axios.post<User>(
        `${import.meta.env.VITE_API_URL}/users`,
        params,
      );
      users.value.push(response.data);
    } catch (e: unknown) {
      if (e instanceof AxiosError) {
        error.value =
          e.response?.data?.message ?? 'Error occurred while adding user';
      } else {
        error.value = 'An unexpected error occurred';
      }
    } finally {
      loading.value = false;
    }
  }

  return {
    loading,
    users,
    error,
    getUsers,
    addUser,
    selectedUsers,
  };
});
