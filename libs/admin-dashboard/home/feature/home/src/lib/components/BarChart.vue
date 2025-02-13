<script lang="ts" setup>
import { Chart } from 'chart.js/auto';
import { onMounted } from 'vue';
import { useTemplateRef } from 'vue';

const props = defineProps<{
  labels: (string | number)[];
  dataset: {
    label: string;
    data: number[];
    backgroundColor: string;
    borderColor: string;
    borderWidth: number;
  }[];
}>();

const ctx = useTemplateRef<HTMLCanvasElement>('bar-chart');

onMounted(() => {
  if (ctx.value) {
    const max = props.dataset.map(
      (dataset) =>
        dataset.data.reduce((acc, value) => {
          if (value > acc) return value;

          return acc;
        }),
      0,
    );

    const barChart = new Chart(ctx.value!, {
      type: 'bar',
      data: {
        labels: props.labels,
        datasets: props.dataset,
      },
      options: {
        plugins: {
          title: {
            display: true,
            text: 'Orders from last 30 days',
          },
        },
        scales: {
          y: {
            ticks: {
              stepSize: 1,
            },
            beginAtZero: true,
            max: max[0] + 1,
          },
        },
      },
    });

    barChart.draw();
  }
});
</script>

<template>
  <div class="bg-content-background p-base rounded-base w-full aspect-video">
    <canvas ref="bar-chart" />
  </div>
</template>
