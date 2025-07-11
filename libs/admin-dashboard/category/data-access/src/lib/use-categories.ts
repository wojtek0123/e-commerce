import { defineStore } from 'pinia';
import { useToast } from 'primevue/usetoast';
import { ref } from 'vue';
import axios, { AxiosError } from 'axios';
import { Category } from '@e-commerce/shared/api-models';

export const useCategoriesStore = defineStore('categories', () => {
  const toast = useToast();

  const categories = ref<Category[]>([]);
  const loading = ref(false);
  const popupLoading = ref(false);
  const error = ref<string | null>();
  const search = ref<string | null>(null);
  const selectedCategories = ref<Category[]>([]);

  async function getCategories() {
    loading.value = true;
    categories.value = [];
    error.value = null;

    try {
      const response = await axios.get<{ items: Category[]; total: number }>(
        `${import.meta.env.VITE_API_URL}/categories`,
        { params: { titleLike: search.value ?? '' } },
      );
      categories.value = response.data.items;
    } catch (e: unknown) {
      if (e instanceof AxiosError) {
        error.value =
          e.response?.data?.message ??
          'Error occurred while fetching categories';
      } else {
        error.value = 'An unexpected error occurred';
      }
    } finally {
      loading.value = false;
    }
  }

  async function addCategory(body: { name: string }) {
    popupLoading.value = true;
    try {
      const { data } = await axios.post<Category>(
        `${import.meta.env.VITE_API_URL}/categories`,
        body,
      );

      toast.add({
        summary: 'Success',
        detail: 'Category has been added',
        severity: 'success',
        life: 5000,
      });

      categories.value = [...categories.value, data];
    } catch (e: unknown) {
      if (e instanceof AxiosError) {
        error.value =
          e.response?.data?.message ??
          'Error occurred while fetching categories';
      } else {
        error.value = 'An unexpected error occurred';
      }
    } finally {
      popupLoading.value = false;
    }
  }

  async function deleteCategories() {
    popupLoading.value = true;

    try {
      const ids = selectedCategories.value.map(({ id }) => id).join(',');

      const respose = await axios.delete(
        `${import.meta.env.VITE_API_URL}/categories`,
        {
          params: { ids },
        },
      );

      if (respose.status !== 200) {
        throw new Error('Something went wrong!');
      }

      categories.value = categories.value.filter(
        ({ id }) => !ids.split(',').includes(id),
      );
      selectedCategories.value = [];
    } catch (e: unknown) {
      let message: string;
      if (e instanceof AxiosError) {
        message =
          e.response?.data?.message ??
          `Error occurred while deleting the ${selectedCategories.value.length === 0 ? 'category' : 'categories'}`;
      } else {
        message = 'An unexpected error occurred';
      }

      toast.add({
        summary: 'Error',
        detail: message,
        severity: 'error',
        life: 5000,
      });
    } finally {
      popupLoading.value = false;
    }
  }

  return {
    categories,
    loading,
    popupLoading,
    error,
    getCategories,
    addCategory,
    selectedCategories,
    deleteCategories,
  };
});
