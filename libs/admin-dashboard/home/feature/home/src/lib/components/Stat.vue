<script lang="ts" setup>
const props = defineProps<{
  header: string;
  value: string | number;
}>();
</script>

<template>
  <div
    class="p-base rounded-base bg-content-background flex flex-col gap-4 items-center"
  >
    <span class="text-muted-color">{{ props.header }}</span>
    <span class="text-xl">{{ props.value }}</span>
  </div>
</template>
