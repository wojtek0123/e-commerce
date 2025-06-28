import { defineStore } from 'pinia';
import { ref } from 'vue';
import { Country } from '@e-commerce/shared/api-models';
import axios, { AxiosError } from 'axios';

export const useCountryStore = defineStore('country', () => {
  const countries = ref<Country[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);
  const selectedCountries = ref<Country[]>([]);

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
    loading.value = true;
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
      loading.value = false;
    }
  }

  return {
    loading,
    countries,
    error,
    getCountries,
    addCountry,
    selectedCountries,
  };
});
