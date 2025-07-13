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
          e.response?.data?.message ?? 'Error occurred while adding category';
      } else {
        error.value = 'An unexpected error occurred';
      }
    } finally {
      popupLoading.value = false;
    }
  }

  async function updateCategory(id: Category['id'], body: { name: string }) {
    popupLoading.value = true;
    try {
      const { data } = await axios.patch<Category>(
        `${import.meta.env.VITE_API_URL}/categories/${id}`,
        body,
      );

      toast.add({
        summary: 'Success',
        detail: 'Category has been added',
        severity: 'success',
        life: 5000,
      });

      const index = categories.value.findIndex((c) => c.id === id);
      categories.value[index] = data;
    } catch (e: unknown) {
      if (e instanceof AxiosError) {
        error.value =
          e.response?.data?.message ??
          'Error occurred while updating category with id: ' + id;
      } else {
        error.value = 'An unexpected error occurred';
      }
    } finally {
      popupLoading.value = false;
    }
  }

  async function deleteCategory(id: Category['id']) {
    popupLoading.value = true;

    try {
      const respose = await axios.delete(
        `${import.meta.env.VITE_API_URL}/categories/${id}`,
      );

      if (respose.status !== 200) {
        throw new Error('Something went wrong!');
      }

      categories.value = categories.value.filter(
        (category) => category.id !== id,
      );
    } catch (e: unknown) {
      let message: string;
      if (e instanceof AxiosError) {
        message =
          e.response?.data?.error ??
          `Error occurred while deleting the category with id: ${id}`;
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
    deleteCategory,
    updateCategory,
  };
});
