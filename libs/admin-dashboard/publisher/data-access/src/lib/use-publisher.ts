import { defineStore } from 'pinia';
import { ref } from 'vue';
import axios, { AxiosError } from 'axios';
import { Publisher } from '@prisma/client';
import { useToast } from 'primevue/usetoast';

export const usePublisherStore = defineStore('publisher', () => {
  const toast = useToast();

  const selectedPublishers = ref<Publisher[]>([]);

  const publishers = ref<Publisher[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);
  const addLoading = ref(false);
  const deleteLoading = ref(false);
  const search = ref<string | null>(null);

  async function getPublishers(search?: string) {
    loading.value = true;
    publishers.value = [];
    error.value = null;

    try {
      const response = await axios.get<Publisher[]>(
        `${import.meta.env.VITE_API_URL}/publishers`,
      );
      publishers.value = response.data;
    } catch (e: unknown) {
      if (e instanceof AxiosError) {
        error.value =
          e.response?.data?.message ??
          'Error occurred while fetching publishers';
      } else {
        error.value = 'An unexpected error occurred';
      }
    } finally {
      loading.value = false;
    }
  }

  async function addPublisher(body: { name: string }) {
    addLoading.value = true;

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/publishers`,
        body,
      );

      publishers.value = [...publishers.value, response.data];
    } catch (e: unknown) {
      let message: string;
      if (e instanceof AxiosError) {
        message =
          e.response?.data?.message ?? 'Error occurred while adding publisher';
      } else {
        message = 'An unexpected error occurred';
      }

      toast.add({
        summary: 'Error',
        detail: message,
        severity: 'error',
      });
    } finally {
      addLoading.value = false;
    }
  }

  async function deletePublishers() {
    loading.value = true;
    try {
      const ids = selectedPublishers.value
        .map((selectedPublisher) => selectedPublisher.id)
        .join(',');

      await axios.delete(`${import.meta.env.VITE_API_URL}/publishers`, {
        params: { ids },
      });

      publishers.value = publishers.value.filter(
        (publisher) => !selectedPublishers.value.includes(publisher),
      );
      selectedPublishers.value = [];
    } catch (e: unknown) {
      let message: string;
      if (e instanceof AxiosError) {
        message =
          e.response?.data?.message ??
          `Error occurred while deleting the ${selectedPublishers.value.length === 0 ? 'publisher' : 'publishers'}`;
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
      loading.value = false;
    }
  }

  return {
    publishers,
    loading,
    search,
    error,
    getPublishers,
    addLoading,
    deleteLoading,
    deletePublishers,
    selectedPublishers,
    addPublisher,
  };
});
