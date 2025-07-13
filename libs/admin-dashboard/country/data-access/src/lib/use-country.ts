import { defineStore } from 'pinia';
import { ref } from 'vue';
import { Country } from '@e-commerce/shared/api-models';
import axios, { AxiosError } from 'axios';

export const useCountryStore = defineStore('country', () => {
  const countries = ref<Country[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);
  const drawerLoading = ref(false);

  async function getCountries() {
    loading.value = true;
    countries.value = [];
    error.value = null;

    try {
      const response = await axios.get<Country[]>(
        `${import.meta.env.VITE_API_URL}/countries`,
      );
      countries.value = response.data;
    } catch (e: unknown) {
      if (e instanceof AxiosError) {
        error.value =
          e.response?.data?.message ??
          'Error occurred while fetching countries';
      } else {
        error.value = 'An unexpected error occurred';
      }
    } finally {
      loading.value = false;
    }
  }

  async function addCountry(params: { name: string; code: string }) {
    drawerLoading.value = true;
    error.value = null;

    try {
      const response = await axios.post<Country>(
        `${import.meta.env.VITE_API_URL}/countries`,
        params,
      );
      countries.value.push(response.data);
    } catch (e: unknown) {
      if (e instanceof AxiosError) {
        error.value =
          e.response?.data?.message ?? 'Error occurred while adding user';
      } else {
        error.value = 'An unexpected error occurred';
      }
    } finally {
      drawerLoading.value = false;
    }
  }

  async function updateCountry(
    id: Country['id'],
    body: { name: string; code: string },
  ) {
    drawerLoading.value = true;
    error.value = null;

    try {
      const response = await axios.patch<Country>(
        `${import.meta.env.VITE_API_URL}/countries/${id}`,
        body,
      );
      const index = countries.value.findIndex((c) => c.id === id);

      if (index !== -1) {
        countries.value[index] = response.data;
      }
    } catch (e: unknown) {
      if (e instanceof AxiosError) {
        error.value =
          e.response?.data?.message ?? 'Error occurred while updating user';
      } else {
        error.value = 'An unexpected error occurred';
      }
    } finally {
      drawerLoading.value = false;
    }
  }

  async function deleteCountry(id: Country['id']) {
    drawerLoading.value = true;
    error.value = null;

    try {
      await axios.delete<Country>(
        `${import.meta.env.VITE_API_URL}/countries/${id}`,
      );

      countries.value = countries.value.filter((c) => c.id !== id);
    } catch (e: unknown) {
      if (e instanceof AxiosError) {
        error.value =
          e.response?.data?.message ?? 'Error occurred while deleting a user';
      } else {
        error.value = 'An unexpected error occurred';
      }
    } finally {
      drawerLoading.value = false;
    }
  }

  return {
    loading,
    countries,
    error,
    getCountries,
    addCountry,
    updateCountry,
    drawerLoading,
    deleteCountry,
  };
});
