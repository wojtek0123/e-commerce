<script lang="ts" setup>
import { useHomeStore } from '@e-commerce/admin-dashboard/home/data-access';
import { onMounted, computed, ref } from 'vue';
import BarChart from './components/BarChart.vue';
import Stat from './components/Stat.vue';

const store = useHomeStore();

// const today = ref(new Date());
// const priorDate = ref(
//   new Date(today.value.getTime() - 30 * 24 * 60 * 60 * 1000),
// );

const groupedOrders = computed(() => {
  // Create an array of the last 30 days
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
  };
});

onMounted(() => {
  store.getOrders();
});
</script>

<template>
  <div class="@container flex flex-col gap-base">
    <div class="grid grid-cols-2 @3xl:grid-cols-3 @6xl:grid-cols-6 gap-base">
      <Stat header="Total revenue" :value="3000" />
      <Stat header="Total orders" :value="2423" />
      <Stat header="Total available books" :value="252" />
      <Stat header="Total revenue" :value="123400" />
      <Stat header="Total revenue" :value="12320" />
      <Stat header="New customer" :value="5434" />
    </div>
    <div class="grid grid-cols-1 @3xl:grid-cols-2 gap-base">
      <BarChart
        v-if="!store.loading && store.orders.length > 0"
        class="w-full"
        :labels="chartData.labels"
        :dataset="chartData.datasets"
      />

      <BarChart
        v-if="!store.loading && store.orders.length > 0"
        class="w-full"
        :labels="chartData.labels"
        :dataset="chartData.datasets"
      />
    </div>
  </div>
</template>
