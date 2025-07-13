import { defineStore } from 'pinia';
import { ref } from 'vue';
import { Role, User } from '@e-commerce/shared/api-models';
import axios, { AxiosError } from 'axios';

export const useUserStore = defineStore('user', () => {
  const users = ref<User[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);
  const popupLoading = ref(false);

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
          e.response?.data?.message ?? 'Error occurred while fetching users';
      } else {
        error.value = 'An unexpected error occurred';
      }
    } finally {
      loading.value = false;
    }
  }

  async function updateUser(
    user: User,
    body: {
      email?: string;
      password?: string;
      role?: Role;
    },
  ) {
    popupLoading.value = true;
    error.value = null;

    body = Object.fromEntries(
      Object.entries(body).filter(
        ([key, value]) => user[key as keyof User] !== value && !!value,
      ),
    );

    (body as typeof body & { newPassword?: string })['newPassword'] =
      body.password;
    delete body.password;

    try {
      const response = await axios.patch<User>(
        `${import.meta.env.VITE_API_URL}/users/${user.id}`,
        body,
      );

      users.value = users.value.map((u) =>
        u.id === user.id ? { ...response.data } : u,
      );
    } catch (e: unknown) {
      if (e instanceof AxiosError) {
        error.value =
          e.response?.data?.message ?? 'Error occurred while updating user';
      } else {
        error.value = 'An unexpected error occurred';
      }
    } finally {
      popupLoading.value = false;
    }
  }

  async function addUser(body: {
    email: string;
    password: string;
    role?: Role;
  }) {
    popupLoading.value = true;
    error.value = null;

    try {
      const response = await axios.post<User>(
        `${import.meta.env.VITE_API_URL}/users`,
        body,
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
      popupLoading.value = false;
    }
  }

  return {
    loading,
    users,
    error,
    getUsers,
    addUser,
    updateUser,
    popupLoading,
  };
});
