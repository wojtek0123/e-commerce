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
import BookFormDrawer from './components/book-form-drawer/book-form-drawer.vue';
import { debounce } from 'lodash-es';
import Image from 'primevue/image';
import { Book } from '@e-commerce/shared/api-models';

const store = useBooksStore();
const confirm = useConfirm();

const home = ref({
  icon: 'pi pi-home',
  route: '/',
});
const breadcrumbs = ref([
  {
    label: 'books',
    route: '/books/list',
  },
]);

function retryGettingBooks() {
  store.getBooks();
}

function deleteBook(book: Book) {
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
      store.deleteBook(book);
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
      class="flex flex-col bg-content-background p-2 rounded-base sm:flex-row justify-between sm:items-center gap-base"
    >
      <Breadcrumb class="min-w-max" :home="home" :model="breadcrumbs">
        <template #item="{ item, props }">
          <router-link
            v-if="item.route"
            v-slot="{ href, navigate }"
            :to="item.route"
            custom
          >
            <a :href="href" v-bind="props.action" @click="navigate">
              <span :class="[item.icon, 'text-color']" />
              <span class="text-primary font-semibold">{{ item.label }}</span>
            </a>
          </router-link>
        </template>
      </Breadcrumb>
      <InputText
        v-model="store.search"
        type="text"
        placeholder="Search book by title..."
        class="w-full h-fit max-w-[30rem]"
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
      v-else
    >
      <DataTable
        :value="store.books"
        :loading="store.loading"
        table-class="w-full min-w-[50rem]"
        class="w-full"
      >
        <template #empty> No books found. </template>
        <Column field="coverImage" header="Cover">
          <template #body="book">
            <Image
              v-if="book.data.coverImage"
              :src="book.data.coverImage"
              :alt="book.data.title"
              width="140"
              preview
            />
            <span v-else>Undefined</span>
          </template>
        </Column>
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
        <Column field="title" header="Title" />
        <Column field="tag" header="Tag">
          <template #body="book">
            <Tag
              v-if="book.data.tag"
              :value="book.data.tag"
              severity="secondary"
            ></Tag>
            <span v-if="!book.data.tag">-</span>
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
        </Column>

        <Column field="price" header="Price" />

        <Column field="language" header="Language" />

        <Column field="inventory" header="Inventory">
          <template #body="book">
            <span>{{ book.data.inventory.quantity }}</span>
          </template>
        </Column>

        <Column field="publisher" header="Publisher">
          <template #body="book">
            <a>{{ book.data.publisher.name }}</a>
          </template>
        </Column>

        <Column field="category" header="Category">
          <template #body="book">
            <span>{{ book.data.category.name }}</span>
          </template>
        </Column>

        <Column class="w-24 !text-end">
          <template #header>
            <div class="flex items-center justify-end w-full">
              <BookFormDrawer />
            </div>
          </template>
          <template #body="{ data }">
            <div class="flex items-center gap-1">
              <BookFormDrawer :book="{ ...data }" />
              <Button
                severity="danger"
                text
                v-tooltip.left="'Delete'"
                :outlined="true"
                icon="pi pi-trash"
                @click="deleteBook(data)"
              />
            </div>
          </template>
        </Column>
      </DataTable>
    </div>
  </div>
</template>
