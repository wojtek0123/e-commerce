<script setup lang="ts">
import Breadcrumb from 'primevue/breadcrumb';
import ConfirmDialog from 'primevue/confirmdialog';
import Button from 'primevue/button';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Skeleton from 'primevue/skeleton';
import InputText from 'primevue/inputtext';
import { usePublisherStore } from '@e-commerce/admin-dashboard/publisher/data-access';
import { onMounted, ref } from 'vue';
import { useConfirm } from 'primevue/useconfirm';
import { debounce } from 'lodash-es';
import PublisherFormDrawer from './publisher-form-drawer/publisher-form-drawer.vue';
import { Publisher } from '@e-commerce/shared/api-models';

const store = usePublisherStore();
const confirm = useConfirm();

const home = ref({
  icon: 'pi pi-home',
  route: '/',
});
const breadcrumbs = ref([
  {
    label: 'publishers',
    route: '/publishers/list',
  },
]);

function retryGettingPublishers() {
  store.getPublishers();
}

function deletePublisher({ id }: Publisher) {
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
      store.deletePublisher(id);
    },
  });
}

const onSearchInput = debounce(() => {
  store.getPublishers();
}, 300);

onMounted(() => {
  store.getPublishers();
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
      <!--      <InputText-->
      <!--        v-model="store.search"-->
      <!--        type="text"-->
      <!--        placeholder="Search publisher by name..."-->
      <!--        class="w-full h-fit max-w-[30rem]"-->
      <!--        @value-change="onSearchInput"-->
      <!--      />-->
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
        @click="retryGettingPublishers()"
      />
    </div>

    <div
      v-else
      class="bg-content-background w-full p-4 rounded-base flex flex-col gap-base"
    >
      <DataTable
        :value="store.publishers"
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
              <PublisherFormDrawer />
            </div>
          </template>
          <template #body="{ data }">
            <div class="flex items-center gap-1">
              <PublisherFormDrawer :publisher="{ ...data }" />
              <Button
                severity="danger"
                text
                :outlined="true"
                v-tooltip.left="'Delete'"
                icon="pi pi-trash"
                @click="deletePublisher(data)"
              />
            </div>
          </template>
        </Column>
      </DataTable>
    </div>
  </div>
</template>
