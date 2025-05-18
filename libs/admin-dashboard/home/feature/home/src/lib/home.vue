<script lang="ts" setup>
import { useHomeStore } from '@e-commerce/admin-dashboard/home/data-access';
import { onMounted, computed } from 'vue';
import BarChart from './components/BarChart.vue';
import PieChart from './components/PieChart.vue';
import Stat from './components/Stat.vue';
import { Book } from '@e-commerce/shared/api-models';

const store = useHomeStore();

const groupedByOrderPrice = computed(() => {
  const dates: string[] = [];
  for (let i = 0; i < 30; i++) {
    const date = new Date(store.priorDate.getTime() + i * 24 * 60 * 60 * 1000);
    dates.push(date.toISOString().split('T')[0]);
  }

  const initialDates = dates.reduce(
    (acc, date) => {
      acc[date] = 0;
      return acc;
    },
    {} as Record<string, number>,
  );

  return store.orders.reduce((acc, order) => {
    const orderDate = new Date(order.createdAt);
    const date = orderDate.toISOString().split('T')[0];

    if (orderDate >= store.priorDate && orderDate <= store.today) {
      acc[date] = (acc[date] || 0) + order.total;
    }
    return acc;
  }, initialDates);
});

const groupedOrders = computed(() => {
  const dates: string[] = [];
  for (let i = 0; i < 30; i++) {
    const date = new Date(store.priorDate.getTime() + i * 24 * 60 * 60 * 1000);
    dates.push(date.toISOString().split('T')[0]);
  }

  const initialDates = dates.reduce(
    (acc, date) => {
      acc[date] = 0;
      return acc;
    },
    {} as Record<string, number>,
  );

  return store.orders.reduce((acc, order) => {
    const orderDate = new Date(order.createdAt);
    const date = orderDate.toISOString().split('T')[0];

    if (orderDate >= store.priorDate && orderDate <= store.today) {
      acc[date] = (acc[date] || 0) + 1;
    }
    return acc;
  }, initialDates);
});

const chartData = computed(() => {
  const dates = Object.keys(groupedOrders.value).sort();

  const max = Object.values<number>(groupedOrders.value).reduce((acc, value) => {
    if (value > acc) return value;

    return acc;
  }, 0);

  return {
    labels: dates.map((date) => {
      const d = new Date(date);
      return (
        d.getDate() + ' ' + d.toLocaleString('default', { month: 'short' })
      );
    }),
    datasets: [
      {
        label: 'Orders per day',
        data: dates.map((date) => groupedOrders.value[date]),
        backgroundColor: '#34d399',
        borderColor: '#34d399',
        borderWidth: 0,
      },
    ],
    title: 'Orders from last 30 days',
    stepSize: 1,
    max: max + 1,
  };
});

const chartOrderPriceData = computed(() => {
  const dates = Object.keys(groupedOrders.value).sort();
  return {
    labels: dates.map((date) => {
      const d = new Date(date);
      return (
        d.getDate() + ' ' + d.toLocaleString('default', { month: 'short' })
      );
    }),
    datasets: [
      {
        label: 'Income per day',
        data: dates.map((date) => groupedByOrderPrice.value[date]),
        backgroundColor: '#34d399',
        borderColor: '#34d399',
        borderWidth: 0,
      },
    ],
    title: 'Income from last 30 days',
  };
});

const totalIncome = computed(() => {
  const today = new Date();

  const todayIncome = store.orders.reduce((acc, order) => {
    const orderDate = new Date(order.createdAt);
    const date = orderDate.toISOString().split('T')[0];

    if (date === today.toISOString().split('T')[0]) {
      return acc + order.total;
    }

    return acc;
  }, 0);

  return {
    total: store.orders.reduce((acc, order) => acc + order.total, 0),
    todayIncome,
  };
});

const todayOrders = computed(() => {
  const today = new Date();

  return store.orders.reduce((acc, order) => {
    const orderDate = new Date(order.createdAt);
    const date = orderDate.toISOString().split('T')[0];

    if (date === today.toISOString().split('T')[0]) {
      return acc + 1;
    }

    return acc;
  }, 0);
});

const customersChange = computed(() => {
  const now = new Date();
  const twentyFourHoursAgo = new Date(now.setHours(now.getHours() - 24));

  return store.customers.reduce((acc, customer) => {
    const customerCreatedAt = new Date(customer.createdAt);

    if (customerCreatedAt >= twentyFourHoursAgo) {
      return acc + 1;
    }

    return acc;
  }, 0);
});

const booksChange = computed(() => {
  const now = new Date();
  const twentyFourHoursAgo = new Date(now.setHours(now.getHours() - 24));

  return store.books.reduce((acc, book) => {
    const customerCreatedAt = new Date(book.createdAt);

    if (customerCreatedAt >= twentyFourHoursAgo) {
      return acc + 1;
    }

    return acc;
  }, 0);
});

const groupBooksByCategory = computed(() => {
  const books = groupBy(store.books, (book: Book) => book.category.name);

  return books;
});

const pieChartBooks = computed(() => {
  const groupByBooks = groupBooksByCategory.value;

  return {
    labels: [...groupByBooks.keys()],
    datasets: [
      {
        data: [...groupByBooks.values()].map((books) => [...books].length),
      },
    ],
    title: 'Books per category',
  };
});

const groupBy = <T, Q>(
  array: T[],
  predicate: (value: T, index: number, array: T[]) => Q,
) =>
  array.reduce((map, value, index, array) => {
    const key = predicate(value, index, array);
    map.get(key)?.push(value) ?? map.set(key, [value]);
    return map;
  }, new Map<Q, T[]>());

onMounted(() => {
  store.getOrders();
  store.getCustomers();
  store.getTotalOrders();
  store.getBooks();
});
</script>

<template>
  <div class="@container flex flex-col gap-base">
    <div class="grid grid-cols-1 @xl:grid-cols-2 @3xl:grid-cols-3 gap-base">
      <Stat
        icon="pi pi-dollar"
        header="Total revenue"
        :value="store.totalIncome"
        :change="totalIncome.todayIncome"
        unit="$"
      />
      <Stat
        header="Total orders"
        icon="pi pi-book"
        info="Daily change"
        :value="store.totalOrders"
        :change="todayOrders"
      />
      <Stat
        icon="pi pi-book"
        header="Total books"
        :value="store.booksTotal"
        :change="booksChange"
      />
      <Stat
        icon="pi pi-user"
        header="Total customers"
        :value="store.customers.length"
        :change="customersChange"
      />
    </div>
    <div class="grid grid-cols-1 @7xl:grid-cols-2 gap-base">
      <BarChart
        v-if="!store.loading && store.orders.length !== undefined"
        :data="chartData"
        class="w-full"
      />

      <BarChart
        v-if="!store.loading && store.orders.length !== undefined"
        class="w-full"
        :data="chartOrderPriceData"
      />
    </div>

    <div class="grid grid-cols-1 @7xl:grid-cols-3 gap-base">
      <PieChart
        v-if="!store.loading && store.books.length > 0"
        :data="pieChartBooks"
      />
    </div>
  </div>
</template>
