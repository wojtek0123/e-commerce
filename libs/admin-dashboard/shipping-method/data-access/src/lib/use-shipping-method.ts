import { defineStore } from 'pinia';
import { useToast } from 'primevue/usetoast';
import { ref } from 'vue';
import axios, { AxiosError } from 'axios';
import { ShippingMethod } from '@e-commerce/shared/api-models';

export const useShippingMethodStore = defineStore('shipping-method', () => {
  const toast = useToast();

  const shippingMethods = ref<ShippingMethod[]>([]);
  const loading = ref(false);
  const popupLoading = ref(false);
  const error = ref<string | null>();
  const search = ref<string | null>(null);

  async function getShippingMethods() {
    loading.value = true;
    shippingMethods.value = [];
    error.value = null;

    try {
      const response = await axios.get<ShippingMethod[]>(
        `${import.meta.env.VITE_API_URL}/shipping-methods`,
        { params: { titleLike: search.value ?? '' } },
      );
      shippingMethods.value = response.data;
    } catch (e: unknown) {
      if (e instanceof AxiosError) {
        error.value =
          e.response?.data?.error ??
          'Error occurred while fetching shipping methods';
      } else {
        error.value = 'An unexpected error occurred';
      }
    } finally {
      loading.value = false;
    }
  }

  async function addShippingMethod(body: {
    name: string;
    price: number;
    deliveryTime: string;
  }) {
    popupLoading.value = true;
    try {
      const { data } = await axios.post<ShippingMethod>(
        `${import.meta.env.VITE_API_URL}/shipping-methods`,
        body,
      );

      toast.add({
        summary: 'Success',
        detail: 'Category has been added',
        severity: 'success',
        life: 5000,
      });

      shippingMethods.value = [...shippingMethods.value, data];
    } catch (e: unknown) {
      if (e instanceof AxiosError) {
        error.value =
          e.response?.data?.error ??
          'Error occurred while adding shipping methods';
      } else {
        error.value = 'An unexpected error occurred';
      }
    } finally {
      popupLoading.value = false;
    }
  }

  async function updateShippingMethod(
    id: ShippingMethod['id'],
    body: {
      name?: string;
      price?: number;
      deliveryTime?: string;
    },
  ) {
    popupLoading.value = true;
    try {
      const { data } = await axios.patch<ShippingMethod>(
        `${import.meta.env.VITE_API_URL}/shipping-methods/${id}`,
        body,
      );

      toast.add({
        summary: 'Success',
        detail: 'Category has been added',
        severity: 'success',
        life: 5000,
      });

      shippingMethods.value = shippingMethods.value.map((method) =>
        method.id === data.id ? { ...data } : { ...method },
      );
    } catch (e: unknown) {
      if (e instanceof AxiosError) {
        error.value =
          e.response?.data?.error ??
          'Error occurred while updating shipping methods';
      } else {
        error.value = 'An unexpected error occurred';
      }
    } finally {
      popupLoading.value = false;
    }
  }

  async function deleteShippingMethod(id: ShippingMethod['id']) {
    popupLoading.value = true;

    try {
      const respose = await axios.delete(
        `${import.meta.env.VITE_API_URL}/shipping-methods/${id}`,
      );

      if (respose.status !== 200) {
        throw new Error('Something went wrong!');
      }

      shippingMethods.value = shippingMethods.value.filter(
        (method) => method.id !== id,
      );
    } catch (e: unknown) {
      let message: string;
      if (e instanceof AxiosError) {
        message =
          e.response?.data?.message ??
          `Error occurred while deleting the shipping methods`;
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
    shippingMethods,
    loading,
    popupLoading,
    error,
    getShippingMethods,
    addShippingMethod,
    deleteShippingMethod,
    updateShippingMethod,
  };
});
