<script setup lang="ts">
import Button from 'primevue/button';
import Tag from 'primevue/tag';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Skeleton from 'primevue/skeleton';
import InputText from 'primevue/inputtext';
import { useBooksStore } from '@e-commerce/admin-dashboard/book/data-access';
import { onMounted } from 'vue';

import AddBookDrawer from './components/add-book-drawer/add-book-drawer.vue';

const store = useBooksStore();

function retryGettingBooks() {
  store.getBooks();
}

onMounted(() => {
  store.getBooks();
});
</script>

<template>
  <div class="flex flex-col gap-base">
    <div
      class="bg-content-background w-full p-4 rounded-base flex justify-between items-center"
    >
      <div class="flex items-center gap-base">
        <AddBookDrawer />
        <Button
          severity="danger"
          :outlined="true"
          icon="pi pi-trash"
          label="Delete"
          @click="store.deleteBooks()"
        ></Button>
      </div>

      <InputText class="w-full max-w-[40rem]" />
    </div>

    <div v-if="store.error" class="flex flex-col items-center gap-4 mt-10">
      <p class="text-5xl text-center">{{ store.error }}</p>
      <p class="text-xl text-muted-color">
        Unable to load books. Please try again.
      </p>
      <Button
        label="Retry"
        icon="pi pi-refresh"
        @click="retryGettingBooks()"
        severity="secondary"
      ></Button>
    </div>

    <DataTable
      v-else
      v-model:selection="store.selectedBooks"
      :value="store.books"
      :loading="store.loading"
      data-key="id"
      table-class="rounded-base overflow-hidden min-w-[50rem]"
    >
      <Column selection-mode="multiple" header-class="w-12"></Column>
      <Column field="id" header="ID">
        <template #loading>
          <div
            class="flex items-center"
            :style="{ height: '17px', 'flex-grow': '1', overflow: 'hidden' }"
          >
            <Skeleton width="60%" height="1rem" />
          </div>
        </template>
      </Column>
      <Column field="title" header="Title">
        <template #loading>
          <div
            class="flex items-center"
            :style="{ height: '17px', 'flex-grow': '1', overflow: 'hidden' }"
          >
            <Skeleton width="60%" height="1rem" />
          </div>
        </template>
      </Column>
      <Column field="tag" header="Tag">
        <template #body="book">
          <Tag
            v-if="book.data.tag"
            :value="book.data.tag"
            severity="secondary"
          ></Tag>
          <span v-if="!book.data.tag">-</span>
        </template>
        <template #loading>
          <div
            class="flex items-center"
            :style="{ height: '17px', 'flex-grow': '1', overflow: 'hidden' }"
          >
            <Skeleton width="60%" height="1rem" />
          </div>
        </template>
      </Column>
      <Column field="authors" header="Authors">
        <template #body="book">
          <span :key="author.id" v-for="(author, index) of book.data.authors">
            {{ author.name
            }}{{ index !== book.data.authors.length - 1 ? ', ' : '' }}
          </span>
          <span v-if="!book.data.authors?.length">-</span>
        </template>

        <template #loading>
          <div
            class="flex items-center"
            :style="{ height: '17px', 'flex-grow': '1', overflow: 'hidden' }"
          >
            <Skeleton width="60%" height="1rem" />
          </div>
        </template>
      </Column>
    </DataTable>
  </div>
</template>
