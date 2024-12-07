<script setup lang="ts">
import Breadcrumb from 'primevue/breadcrumb';
import ConfirmDialog from 'primevue/confirmdialog';
import Button from 'primevue/button';
import Tag from 'primevue/tag';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Skeleton from 'primevue/skeleton';
import InputText from 'primevue/inputtext';
import { useBooksStore } from '@e-commerce/admin-dashboard/book/data-access';
import { onMounted, ref } from 'vue';
import { useConfirm } from 'primevue/useconfirm';
import AddBookDrawer from './components/add-book-drawer/add-book-drawer.vue';
import { debounce } from 'lodash-es';
import viewBookDetails from './components/view-book-details/view-book-details.vue';

const store = useBooksStore();
const confirm = useConfirm();

const home = ref({
  icon: 'pi pi-home',
  route: '/',
});
const breadcrumbs = ref([
  {
    label: 'books',
  },
]);

function retryGettingBooks() {
  store.getBooks();
}

function deleteBooks() {
  confirm.require({
    message: 'Are you sure you want to proceed?',
    header: 'Confirmation',
    icon: 'pi pi-exclamation-triangle',
    rejectProps: {
      label: 'Cancel',
      severity: 'secondary',
      outlined: true,
    },
    acceptProps: {
      label: 'Delete',
      severity: 'danger',
    },
    accept: () => {
      store.deleteBooks();
    },
  });
}

const onSearchInput = debounce(() => {
  store.getBooks();
}, 300);

onMounted(() => {
  store.getBooks();
});
</script>

<template>
  <ConfirmDialog />
  <div class="flex flex-col gap-base">
    <div
      class="bg-content-background w-full p-4 rounded-base flex justify-between items-center"
    >
      <Breadcrumb :home="home" :model="breadcrumbs" />
      <InputText
        placeholder="Search book by title..."
        class="w-full max-w-[40rem]"
        v-model="store.search"
        @value-change="onSearchInput"
      />
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

    <div
      class="bg-content-background w-full p-4 rounded-base flex flex-col gap-base"
    >
      <div class="flex flex-items gap-4">
        <AddBookDrawer />
        <Button
          v-if="store.selectedBooks.length !== 0"
          severity="danger"
          text
          :outlined="true"
          icon="pi pi-trash"
          @click="deleteBooks()"
        ></Button>
      </div>
      <DataTable
        v-if="!store.error"
        v-model:selection="store.selectedBooks"
        :value="store.books"
        :loading="store.loading"
        table-class="w-full min-w-[50rem]"
        class="w-full"
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

        <Column class="w-24 !text-end">
          <template #body="{ data }">
            <viewBookDetails :book="{ ...data }" />
          </template>
        </Column>
      </DataTable>
    </div>
  </div>
</template>
