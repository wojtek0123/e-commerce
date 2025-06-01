<template>
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
      <!-- <Button
        label="Retry"
        icon="pi pi-refresh"
        severity="secondary"
        :loading="store.popupLoading"
        @click="retry()"
      /> -->
    </div>

    <div
      v-else
      class="bg-content-background w-full p-4 rounded-base flex flex-col gap-base"
    >
      <div class="flex flex-items gap-4">
        <AddUserDrawer />
        <!-- <AddCategoryFormDrawer /> -->
        <!-- <Button
          v-if="store.selectedUsers.length !== 0"
          severity="danger"
          text
          :outlined="true"
          icon="pi pi-trash"
          @click="isDeleteDialogVisible = true"
        /> -->
      </div>
      <DataTable
        v-model:selection="store.selectedUsers"
        :value="store.users"
        :loading="store.loading"
        table-class="w-full min-w-[50rem]"
        class="w-full"
      >
        <Column selection-mode="multiple" header-class="w-12" />
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
        <Column field="email" header="Email">
          <template #loading>
            <div
              class="flex items-center"
              :style="{ height: '17px', 'flex-grow': '1', overflow: 'hidden' }"
            >
              <Skeleton width="60%" height="1rem" />
            </div>
          </template>
        </Column>
        <Column header="Role">
          <template #body="user">
            <Tag
              v-if="user.data.role"
              :value="user.data.role"
              severity="secondary"
            />
          </template>
        </Column>

        <Column class="w-24 !text-end">
          <template #body="{ data }">
            <!-- <AddUserDrawer :user="data" /> -->
          </template>
        </Column>
      </DataTable>
    </div>
  </div>
</template>

<script setup lang="ts">
import Breadcrumb from 'primevue/breadcrumb';
import Button from 'primevue/button';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Message from 'primevue/message';
import Skeleton from 'primevue/skeleton';
import Dialog from 'primevue/dialog';
import Tag from 'primevue/tag';
import { ref, onMounted } from 'vue';
import { useUserStore } from '@e-commerce/admin-dashboard/user/data-access';
import AddUserDrawer from './components/add-user-drawer/add-user-drawer.vue';

const store = useUserStore();

const breadcrumbs = ref([
  {
    label: 'users',
    route: '/users/list',
  },
]);
const home = ref({
  icon: 'pi pi-home',
  route: '/',
});

function retry() {
  store.getUsers();
}

onMounted(() => {
  store.getUsers();
});
</script>
