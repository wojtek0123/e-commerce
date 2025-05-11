<script setup lang="ts">
import Breadcrumb from 'primevue/breadcrumb';
import Button from 'primevue/button';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Message from 'primevue/message';
import Skeleton from 'primevue/skeleton';
import Dialog from 'primevue/dialog';
import { useCategoriesStore } from '@e-commerce/admin-dashboard/category/data-access';
import { onMounted } from 'vue';
import { ref } from 'vue';
import AddCategoryFormDrawer from '../lib/components/add-category-form-drawer/add-category-form-drawer.vue';
import { computed } from 'vue';

const store = useCategoriesStore();

const breadcrumbs = ref([{ label: 'categories', route: '/categories/list' }]);
const home = ref({
  icon: 'pi pi-home',
  route: '/',
});
const isDeleteDialogVisible = ref(false);
const isMoreThanOneCategorySelected = computed(
  () => store.selectedCategories.length > 1,
);

function retry() {
  store.getCategories();
}

function deleteCategories() {
  store.deleteCategories().then(() => {
    isDeleteDialogVisible.value = false;
  });
}

onMounted(() => {
  store.getCategories();
});
</script>

<template>
  <Dialog
    v-model:visible="isDeleteDialogVisible"
    header="Delete confirmation"
  >
    <div class="flex flex-col gap-4">
      <div class="flex flex-col gap-4">
        <p>
          Are you sure you want to delete
          {{
            isMoreThanOneCategorySelected
              ? 'these categories'
              : 'this category'
          }}?
        </p>
        <Message severity="error">
          You can delete books related to
          {{
            isMoreThanOneCategorySelected
              ? 'these categories'
              : 'this category'
          }}!
        </Message>
      </div>
      <div class="flex items-center gap-4 w-full">
        <Button
          outlined
          severity="secondary"
          label="Cancel"
          class="w-full"
          @click="isDeleteDialogVisible = false"
        />
        <Button
          label="Confirm"
          class="w-full"
          @click="deleteCategories"
        />
      </div>
    </div>
  </Dialog>
  <div class="flex flex-col gap-base">
    <div
      class="flex flex-col bg-content-background pt-2 pb-4 xl:pb-2 xl:pl-2 xl:pr-4 rounded-base xl:flex-row justify-between xl:items-center gap-base"
    >
      <Breadcrumb
        :home="home"
        :model="breadcrumbs"
      >
        <template #item="{ item, props }">
          <router-link
            v-if="item.route"
            v-slot="{ href, navigate }"
            :to="item.route"
            custom
          >
            <a
              :href="href"
              v-bind="props.action"
              @click="navigate"
            >
              <span :class="[item.icon, 'text-color']" />
              <span class="text-primary font-semibold">{{ item.label }}</span>
            </a>
          </router-link>
        </template>
      </Breadcrumb>
    </div>

    <div
      v-if="store.error"
      class="flex flex-col items-center gap-4 mt-10"
    >
      <p class="text-5xl text-center">
        {{ store.error }}
      </p>
      <p class="text-xl text-muted-color">
        Unable to load books. Please try again.
      </p>
      <Button
        label="Retry"
        icon="pi pi-refresh"
        severity="secondary"
        :toading="store.popupLoading"
        @click="retry()"
      />
    </div>

    <div
      v-else
      class="bg-content-background w-full p-4 rounded-base flex flex-col gap-base"
    >
      <div class="flex flex-items gap-4">
        <AddCategoryFormDrawer />
        <Button
          v-if="store.selectedCategories.length !== 0"
          severity="danger"
          text
          :outlined="true"
          icon="pi pi-trash"
          @click="isDeleteDialogVisible = true"
        />
      </div>
      <DataTable
        v-model:selection="store.selectedCategories"
        :value="store.categories"
        :loading="store.loading"
        table-class="w-full min-w-[50rem]"
        class="w-full"
      >
        <Column
          selection-mode="multiple"
          header-class="w-12"
        />
        <Column
          field="id"
          header="ID"
        >
          <template #loading>
            <div
              class="flex items-center"
              :style="{ height: '17px', 'flex-grow': '1', overflow: 'hidden' }"
            >
              <Skeleton
                width="60%"
                height="1rem"
              />
            </div>
          </template>
        </Column>
        <Column
          field="name"
          header="Name"
        >
          <template #loading>
            <div
              class="flex items-center"
              :style="{ height: '17px', 'flex-grow': '1', overflow: 'hidden' }"
            >
              <Skeleton
                width="60%"
                height="1rem"
              />
            </div>
          </template>
        </Column>

        <Column class="w-24 !text-end">
          <!--<template #body="{ data }">
            <ViewBookDetails :category="{ ...data }" />
          </template>-->
        </Column>
      </DataTable>
    </div>
  </div>
</template>
