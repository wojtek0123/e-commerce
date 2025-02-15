<script lang="ts" setup>
const { header, value, change, unit } = defineProps<{
  header: string;
  value: string | number;
  change?: string | number;
  unit?: string;
}>();
</script>

<template>
  <div
    class="@container p-base rounded-base bg-content-background flex flex-col gap-4 items-center"
  >
    <span class="text-muted-color text-center">{{ header }}</span>
    <span class="text-xl flex items-center gap-2 flex-col @xs:flex-row">
      {{ value }}{{ unit }}
      <span
        v-if="change !== undefined"
        class="rounded flex items-center gap-1 px-1 py-0.5"
        :class="change === 0 ? 'bg-gray-600 dark:bg-gray-700' : 'bg-green-900'"
      >
        <span
          class="text-sm"
          :class="change === 0 ? 'text-gray-300' : 'text-green-300'"
        >
          {{ change }}
        </span>
        <span
          class="text-xs"
          :class="
            change === 0
              ? 'pi pi-caret-right text-gray-300'
              : 'pi pi-caret-up text-green-300'
          "
        />
      </span>
    </span>
  </div>
</template>
