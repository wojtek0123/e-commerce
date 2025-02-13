import { defineStore } from 'pinia';
import { ref } from 'vue';
import { OrderDetails } from '@e-commerce/shared/api-models';
import axios, { AxiosError } from 'axios';

export const useHomeStore = defineStore('home', () => {
  const orders = ref<OrderDetails[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const today = ref(new Date());
  const priorDate = ref(
    new Date(today.value.getTime() - 30 * 24 * 60 * 60 * 1000),
  );

  async function getOrders() {
    loading.value = true;
    orders.value = [];
    error.value = null;

    try {
      const response = await axios.get<OrderDetails[]>(
        `${import.meta.env.VITE_API_URL}/order-details`,
        {
          params: {
            startDate: priorDate.value.toISOString(),
            endDate: today.value.toISOString(),
          },
        },
      );
      orders.value = response.data;
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

  return {
    getOrders,
    orders,
    loading,
    error,
    today,
    priorDate,
  };
});
