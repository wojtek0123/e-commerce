<script setup lang="ts">
import { RouterView } from 'vue-router';
</script>

<template>
  <div class="flex flex-col-reverse gap-4 xl:grid xl:h-content xl:grid-cols-2">
    <div class="flex flex-col items-center justify-center w-full">
      <div
        class="max-w-[30rem] flex flex-col items-center justify-center w-full"
      >
        <RouterView />
      </div>
    </div>
    <div
      class="rounded-base overflow-hidden flex w-full h-full xl:content-end xl:h-content"
    >
      <img
        class="object-fill object-center w-full"
        src="/auth-books.webp"
        alt="book store"
      />
    </div>
  </div>
</template>
