import { defineStore } from 'pinia';
import { ref } from 'vue';
import {
  Book,
  OrderDetails,
  User,
  Paginated,
} from '@e-commerce/shared/api-models';
import axios, { AxiosError } from 'axios';
import { Role } from '@prisma/client';

export const useHomeStore = defineStore('home', () => {
  const orders = ref<OrderDetails[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const booksTotal = ref(0);
  const books = ref<Book[]>([]);

  const customers = ref<User[]>([]);

  const totalOrders = ref(0);
  const totalIncome = ref(0);

  const today = ref(new Date());
  const priorDate = ref(
    new Date(today.value.getTime() - 30 * 24 * 60 * 60 * 1000),
  );

  async function getOrders() {
    loading.value = true;
    orders.value = [];
    error.value = null;

    try {
      const response = await axios.get<Paginated<OrderDetails>>(
        `${import.meta.env.VITE_API_URL}/order-details`,
        {
          params: {
            startDate: priorDate.value.toISOString(),
            endDate: today.value.toISOString(),
          },
        },
      );
      orders.value = response.data.items;
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

  async function getTotalOrders() {
    error.value = null;

    try {
      const response = await axios.get<OrderDetails[]>(
        `${import.meta.env.VITE_API_URL}/order-details`,
      );
      totalOrders.value = response.data.length;
      totalIncome.value = +response.data
        .reduce((acc, order) => acc + order.total, 0)
        .toFixed(2);
    } catch (e: unknown) {
      if (e instanceof AxiosError) {
        error.value =
          e.response?.data?.message ?? 'Error occurred while fetching books';
      } else {
        // error.value = 'An unexpected error occurred';
      }
    } finally {
      // loading.value = false;
    }
  }

  async function getCustomers() {
    try {
      const response = await axios.get<User[]>(
        `${import.meta.env.VITE_API_URL}/users`,
        {
          params: {
            roleIn: Role.USER,
          },
        },
      );
      customers.value = response.data;
    } catch (e: unknown) {
      if (e instanceof AxiosError) {
        error.value =
          e.response?.data?.message ?? 'Error occurred while fetching books';
      } else {
        error.value = 'An unexpected error occurred';
      }
    } finally {
      // loading.value = false;
    }
  }

  async function getBooks() {
    try {
      const response = await axios.get<Paginated<Book>>(
        `${import.meta.env.VITE_API_URL}/books`,
      );
      booksTotal.value = response.data.total;
      books.value = response.data.items;
    } catch (e: unknown) {
      if (e instanceof AxiosError) {
        error.value =
          e.response?.data?.message ?? 'Error occurred while fetching books';
      } else {
        error.value = 'An unexpected error occurred';
      }
    } finally {
      // loading.value = false;
    }
  }

  return {
    getOrders,
    getCustomers,
    getTotalOrders,
    getBooks,
    booksTotal,
    totalOrders,
    customers,
    orders,
    loading,
    error,
    today,
    priorDate,
    totalIncome,
    books,
  };
});
