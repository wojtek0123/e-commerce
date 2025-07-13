<template>
  <ConfirmDialog />
  <div class="flex flex-col gap-base">
    <div
      class="flex flex-col bg-content-background p-2 rounded-base xl:flex-row justify-between xl:items-center gap-base"
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
        Unable to load countries. Please try again.
      </p>
      <Button
        label="Retry"
        icon="pi pi-refresh"
        severity="secondary"
        :loading="store.loading"
        @click="retry()"
      />
    </div>

    <div
      v-else
      class="bg-content-background w-full p-4 rounded-base flex flex-col gap-base"
    >
      <DataTable
        :value="store.countries"
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

        <Column field="code" header="Code">
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
              <CountryFormDrawer />
            </div>
          </template>
          <template #body="{ data }">
            <div class="flex items-center gap-1">
              <CountryFormDrawer :country="{ ...data }" />

              <Button
                severity="danger"
                text
                v-tooltip.left="'Delete'"
                :outlined="true"
                icon="pi pi-trash"
                @click="deleteCountry(data)"
              />
            </div>
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
import Skeleton from 'primevue/skeleton';
import { ref, onMounted } from 'vue';
import { useCountryStore } from '@e-commerce/admin-dashboard/country/data-access';
import CountryFormDrawer from './country-form-drawer/country-form-drawer.vue';
import { Country } from '@e-commerce/shared/api-models';
import { useConfirm } from 'primevue/useconfirm';
import ConfirmDialog from 'primevue/confirmdialog';

const store = useCountryStore();
const confirm = useConfirm();

const breadcrumbs = ref([
  {
    label: 'countries',
    route: '/countries/list',
  },
]);
const home = ref({
  icon: 'pi pi-home',
  route: '/',
});

function retry() {
  store.getCountries();
}

function deleteCountry({ id }: Country) {
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
      store.deleteCountry(id);
    },
  });
}

onMounted(() => {
  store.getCountries();
});
</script>
