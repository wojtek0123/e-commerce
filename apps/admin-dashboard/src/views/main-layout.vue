<script setup lang="ts">
import { Nav } from '@e-commerce/admin-dashboard/core/domain';
</script>

<template>
  <Nav />
  <div
    class="w-full h-full overflow-y-auto p-4 xl:pl-gap xl:p-0 xl:overflow-y-visible"
  >
    <RouterView />
  </div>
</template>
