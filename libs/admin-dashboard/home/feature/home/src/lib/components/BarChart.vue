<script lang="ts" setup>
import { Chart } from 'chart.js/auto';
import { onMounted, useTemplateRef } from 'vue';

const { data } = defineProps<{
  data: {
    labels: (string | number)[];
    datasets: {
      label: string;
      data: number[];
      backgroundColor: string;
      borderColor: string;
      borderWidth: number;
    }[];
    title: string;
    stepSize?: number;
    max?: number;
  };
}>();

const ctx = useTemplateRef<HTMLCanvasElement>('bar-chart');

onMounted(() => {
  if (ctx.value) {
    const barChart = new Chart(ctx.value, {
      type: 'bar',
      data: {
        labels: data.labels,
        datasets: data.datasets,
      },
      options: {
        plugins: {
          title: {
            display: true,
            text: data.title,
          },
        },
        scales: {
          y: {
            ticks: {
              ...(data.stepSize && { stepSize: data.stepSize }),
            },
            beginAtZero: true,
            ...(data.max && { max: data.max }),
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
