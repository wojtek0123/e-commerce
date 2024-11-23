<script setup lang="ts">
import Tag from 'primevue/tag';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Skeleton from 'primevue/skeleton';
import { useBooksStore } from '@e-commerce/admin-dashboard/book/data-access';
import { onMounted } from 'vue';

const store = useBooksStore();

onMounted(() => {
  store.getBooks();
});
</script>

<template>
  <DataTable
    :value="store.books"
    :loading="store.loading"
    table-class="rounded-base overflow-hidden min-w-[50rem]"
  >
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
        <Tag :value="book.data.tag" severity="secondary"></Tag>
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
</template>
