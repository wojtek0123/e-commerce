<script setup lang="ts">
import { RouterLink } from 'vue-router';
import Toolbar from 'primevue/toolbar';
import Button from 'primevue/button';
import Divider from 'primevue/divider';
import { useCoreStore } from '@e-commerce/admin-dashboard/core/data-access';
import { useAuthService } from '@e-commerce/admin-dashboard/auth/api';

const store = useCoreStore();
const authService = useAuthService();
</script>

<template>
  <div class="w-full flex items-center sticky bottom-0 left-0 right-0 xl:hidden">
    <Toolbar class="bg-content-background border-none w-full">
      <template #center>
        <div class="mx-auto max-w-lg w-full flex items-center justify-evenly gap-4">
          <Button size="large" text icon="pi pi-bars"
            class="text-muted-color h-10 !rounded-base overflow-hidden hover:bg-surface-100 hover:dark:bg-surface-700" />
          <RouterLink to="/" active-class="bg-surface-50 dark:bg-surface-800 rounded-base"
            class="text-muted-color px-3 h-10 flex items-center gap-4 !rounded-base overflow-hidden hover:bg-surface-100 hover:dark:bg-surface-700 cursorpointer">
            <i class="pi pi-home"></i>
          </RouterLink>
        </div>
      </template>
    </Toolbar>
  </div>

  <div class="max-w-80">
    <aside :class="[
      store.isExpanded ? 'w-80' : 'w-14',
      'transition-[width] duration-300 ease-in-out hidden justify-between gap-4 xl:h-content px-2 py-4 bg-content-background xl:sticky z-[501] top-4 flex-col rounded-base xl:flex',
    ]">
      <nav class="h-content flex flex-col justify-between">
        <div class="flex flex-col">
          <div class="h-9 flex items-center justify-center">
            <RouterLink to="/" v-if="store.shouldLabelBeShowed" class="items-center justify-center">
              <span class="font-bold text-primary">Story</span>
              <span class="uppercase text-muted-color">Stash</span>
            </RouterLink>

            <RouterLink v-if="!store.shouldLabelBeShowed" to="/"
              exact-active-class="bg-surface-50 dark:bg-surface-800 rounded-base"
              class="text-muted-color px-3 h-10 flex items-center gap-4 !rounded-base overflow-hidden hover:bg-surface-100 hover:dark:bg-surface-700">
              <i class="pi pi-home"></i>
            </RouterLink>
          </div>
          <Divider />
          <ul class="flex flex-col">
            <RouterLink to="/books" activeClass="bg-surface-50 dark:bg-surface-800"
              class="text-muted-color px-3 h-10 flex items-center gap-4 !rounded-base overflow-hidden hover:bg-surface-100 hover:dark:bg-surface-700 cursorpointer">
              <i class="pi pi-book"></i>
              <span v-if="store.isExpanded">Books</span>
            </RouterLink>

            <RouterLink to="/categories" activeClass="bg-surface-50 dark:bg-surface-800"
              class="text-muted-color px-3 h-10 flex items-center gap-4 !rounded-base overflow-hidden hover:bg-surface-100 hover:dark:bg-surface-700 cursorpointer">
              <i class="pi pi-objects-column"></i>
              <span v-if="store.isExpanded">Categories</span>
            </RouterLink>

            <RouterLink to="/users" activeClass="bg-surface-50 dark:bg-surface-800"
              class="text-muted-color px-3 h-10 flex items-center gap-4 !rounded-base overflow-hidden hover:bg-surface-100 hover:dark:bg-surface-700 cursorpointer">
              <i class="pi pi-objects-column"></i>
              <span v-if="store.isExpanded">Users</span>
            </RouterLink>
          </ul>
        </div>

        <div class="flex flex-col gap-2">
          <button
            class="text-muted-color px-3 h-10 flex items-center gap-4 !rounded-base overflow-hidden hover:bg-surface-100 hover:dark:bg-surface-700"
            @click="authService.logout">
            <i class="pi pi-sign-out"></i>
            <span v-if="store.isExpanded">Log out</span>
          </button>
          <Divider />
          <button
            class="text-muted-color px-3 h-10 flex items-center gap-4 !rounded-base overflow-hidden hover:bg-surface-100 hover:dark:bg-surface-700"
            @click="store.toggleTheme">
            <i v-if="store.isDark" class="pi pi-moon"></i>
            <i v-if="!store.isDark" class="pi pi-sun"></i>
            <span v-if="store.isExpanded">
              {{ store.isDark ? 'Dark' : 'Light' }}
            </span>
          </button>
          <button
            class="text-muted-color px-3 h-10 flex items-center gap-4 !rounded-base overflow-hidden hover:bg-surface-100 hover:dark:bg-surface-700"
            @click="store.toggleExpandCollapse">
            <i v-if="store.isExpanded" class="pi pi-arrow-left"></i>
            <i v-if="!store.isExpanded" class="pi pi-arrow-right"></i>
            <span>Collapse</span>
          </button>
        </div>
      </nav>
    </aside>
  </div>
</template>
