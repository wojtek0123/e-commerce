<script setup lang="ts">
import { RouterView } from 'vue-router';
import Toast from 'primevue/toast';

import { onMounted } from 'vue';
import { useCoreStore } from '@e-commerce/admin-dashboard/core/data-access';
import { useAuthService } from '@e-commerce/admin-dashboard/auth/api';

const coreStore = useCoreStore();
const authApiService = useAuthService();

onMounted(() => {
  coreStore.getTheme();
  coreStore.getExpanded();

  authApiService.getSessionFromStorage();
});
</script>

<template>
  <Toast />
  <div
    class="flex flex-col-reverse w-full h-svh xl:flex-row xl:p-gap xl:min-h-svh xl:h-full"
  >
    <RouterView />
  </div>
</template>
