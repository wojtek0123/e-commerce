<script setup lang="ts">
import Drawer from 'primevue/drawer';
import Button from 'primevue/button';
import { ref } from 'vue';
import { Book } from '@e-commerce/shared/api-models';

const { book } = defineProps<{ book: Book }>();

const visible = ref<boolean>(false);
</script>

<template>
  <Button severity="secondary" text icon="pi pi-eye" @click="visible = true" />
  <Drawer v-model:visible="visible" class="max-w-[40rem] w-full rounded-r-base">
    <div class="flex flex-col gap-4">
      <img
        :src="book.coverImage"
        :alt="book.title + 'cover image'"
        class="w-full rounded-base"
      />
      <div class="flex flex-col gap-2">
        <label class="text-sm text-muted-color">Title</label>
        <span>{{ book.title }}</span>
      </div>
      <div class="flex flex-col gap-2">
        <label class="text-sm text-muted-color">Authors</label>
        <div class="flex flex-wrap gap-2">
          <span v-for="author in book.authors" v-bind:key="author.id">
            {{ author.name }}
          </span>
        </div>
      </div>

      <div class="flex flex-col gap-2">
        <label class="text-sm text-muted-color">Price</label>
        <span>{{ book.price }}$</span>
      </div>

      <div class="flex flex-col gap-2">
        <label class="text-sm text-muted-color">Page count</label>
        <span>{{ book.pages }}</span>
      </div>

      <div class="flex flex-col gap-2">
        <label class="text-sm text-muted-color">Language</label>
        <span>{{ book.language }}</span>
      </div>

      <div v-if="book.tag" class="flex flex-col gap-2">
        <label class="text-sm text-muted-color">Tag</label>
        <span>{{ book.tag }}</span>
      </div>
    </div>
  </Drawer>
</template>
