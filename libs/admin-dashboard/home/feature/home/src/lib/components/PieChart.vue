<script lang="ts" setup>
import { Chart } from 'chart.js/auto';
import { onMounted, useTemplateRef } from 'vue';
import ChartDataLabels from 'chartjs-plugin-datalabels';

const { data } = defineProps<{
  data: {
    labels: (string | number)[];
    datasets: {
      label: string;
      data: number[];
    }[];
    title: string;
  };
}>();

const ctx = useTemplateRef<HTMLCanvasElement>('pie-chart');

onMounted(() => {
  if (ctx.value) {
    const pieChart = new Chart<'pie'>(ctx.value, {
      type: 'pie',
      data: {
        labels: data.labels,
        datasets: data.datasets,
      },
      plugins: [ChartDataLabels],
      options: {
        plugins: {
          datalabels: {
            color: '#fff',
            font: (context) => {
              const width = context.chart.width;
              return {
                weight: 'bold',
                size: Math.round(width / 26),
              };
            },
            formatter: (value, context) => {
              const total = (context.dataset.data as number[]).reduce(
                (acc, value) => {
                  if (typeof value === 'number') {
                    return acc + value;
                  }
                  return acc;
                },
                0,
              );

              return `${(value / total) * 100}%`;
            },
          },
          title: {
            display: true,
            text: data.title,
          },
          legend: {
            display: true,
            position: 'top',
          },
          tooltip: {
            enabled: true,
            callbacks: {
              title: (context) => {
                const value = context[0].raw;
                const label = context[0].label;

                return `${label}: ${value}`;
              },
              label: function (context) {
                return '';
              },
            },
          },
        },
      },
    });

    pieChart.draw();
  }
});
</script>

<template>
  <div class="bg-content-background p-base rounded-base w-full aspect-square">
    <canvas ref="pie-chart" />
  </div>
</template>
