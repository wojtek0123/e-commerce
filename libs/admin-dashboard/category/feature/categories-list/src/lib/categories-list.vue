<script setup lang="ts">
import Breadcrumb from 'primevue/breadcrumb';
import Button from 'primevue/button';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Skeleton from 'primevue/skeleton';
import { useCategoriesStore } from '@e-commerce/admin-dashboard/category/data-access';
import { onMounted } from 'vue';
import { ref } from 'vue';
import { Category } from '@e-commerce/shared/api-models';
import { useConfirm } from 'primevue/useconfirm';
import CategoryFormDrawer from '../lib/category-form-drawer/category-form-drawer.vue';
import ConfirmDialog from 'primevue/confirmdialog';

const store = useCategoriesStore();
const confirm = useConfirm();

const breadcrumbs = ref([{ label: 'categories', route: '/categories/list' }]);
const home = ref({
  icon: 'pi pi-home',
  route: '/',
});

function deleteCategory(category: Category) {
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
      store.deleteCategory(category.id);
    },
  });
}

onMounted(() => {
  store.getCategories();
});
</script>

<template>
  <ConfirmDialog />
  <div class="flex flex-col gap-base">
    <div
      class="flex flex-col bg-content-background pt-2 pb-4 xl:pb-2 xl:pl-2 xl:pr-4 rounded-base xl:flex-row justify-between xl:items-center gap-base"
    >
      <Breadcrumb :home="home" :model="breadcrumbs">
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
    </div>

    <div v-if="store.error" class="flex flex-col items-center gap-4 mt-10">
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
        @click="store.getCategories"
      />
    </div>

    <div
      v-else
      class="bg-content-background w-full p-4 rounded-base flex flex-col gap-base"
    >
      <div class="flex flex-items gap-4">
        <AddCategoryFormDrawer />
      </div>
      <DataTable
        :value="store.categories"
        :loading="store.loading"
        table-class="w-full min-w-[50rem]"
        class="w-full"
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
        <Column field="name" header="Name">
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
          <template #header>
            <div class="flex justify-end w-full">
              <CategoryFormDrawer />
            </div>
          </template>
          <template #body="{ data }">
            <div class="flex items-center gap-1">
              <CategoryFormDrawer :category="data" />
              <Button
                severity="danger"
                text
                v-tooltip.left="'Delete'"
                :outlined="true"
                icon="pi pi-trash"
                @click="deleteCategory(data)"
              />
            </div>
          </template>
        </Column>
      </DataTable>
    </div>
  </div>
</template>
