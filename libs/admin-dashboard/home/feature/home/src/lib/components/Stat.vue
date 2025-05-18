<script lang="ts" setup>
import { computed } from 'vue';
const { header, value, change, unit, info, icon } = defineProps<{
  header: string;
  value: number;
  change?: number;
  unit?: string;
  info?: string;
  icon?: string;
}>();

const formattedChange = computed(() => {
  if (!change) {
    return 'stable';
  }

  return change > 0 ? 'growing' : 'declining';
});
</script>

<template>
  <div class="@container p-base rounded-base bg-content-background flex flex-col gap-4">
    <div class="flex items-center gap-2 justify-between">
      <div class="flex items-center gap-2">
        <span
          v-if="!!icon"
          :class="icon"
        />
        <span class="text-muted-color text-center">{{ header }}</span>
      </div>
      <span
        v-if="!!info"
        class="pi pi-info-circle text-muted-color"
        :title="info"
      />
    </div>
    <span class="flex gap-2 flex-row items-center @xs:gap-4">
      <span class="text-3xl">{{ value }}{{ unit }}</span>
      <span
        v-if="change !== undefined"
        class="rounded flex items-center min-w-min h-min gap-1 px-2 py-0.5"
        :class="change === 0 ? 'bg-gray-100' : change > 0 ? 'bg-green-100' : 'bg-red-100'"
      >
        <span
          class="text-sm"
          :class="change === 0 ? 'text-gray-800' : change > 0 ? 'text-green-800' : 'text-red-800'"
        >
          {{ change }}
        </span>
        <span
          class="text-xs"
          :class="change === 0
            ? 'pi pi-arrow-right text-gray-800'
            : change > 0 ? 'pi pi-arrow-up-right text-green-800' : 'pi pi-arrow-down-right text-red-800'
          "
        />
      </span>
    </span>
  </div>
</template>
