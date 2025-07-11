<script setup lang="ts">
import { RouterLink } from 'vue-router';
import Toolbar from 'primevue/toolbar';
import Divider from 'primevue/divider';
import { useCoreStore } from '@e-commerce/admin-dashboard/core/data-access';
import { useAuthService } from '@e-commerce/admin-dashboard/auth/api';

const store = useCoreStore();
const authService = useAuthService();
</script>

<template>
  <div
    class="w-full flex items-center sticky bottom-0 left-0 right-0 xl:hidden"
  >
    <Toolbar class="bg-content-background border-none w-full">
      <template #center>
        <div
          class="mx-auto max-w-lg w-full flex items-center justify-evenly gap-4"
        >
          <RouterLink
            to="/"
            exact-active-class="bg-surface-50 dark:bg-surface-800 rounded-base"
            class="text-muted-color px-3 h-10 flex items-center gap-4 !rounded-base overflow-hidden hover:bg-surface-100 hover:dark:bg-surface-700"
          >
            <i class="pi pi-home"></i>
          </RouterLink>

          <RouterLink
            to="/books"
            active-class="bg-surface-50 dark:bg-surface-800 rounded-base"
            class="text-muted-color px-3 h-10 flex items-center gap-4 !rounded-base overflow-hidden hover:bg-surface-100 hover:dark:bg-surface-700"
          >
            <i class="pi pi-book"></i>
          </RouterLink>

          <RouterLink
            to="/categories"
            active-class="bg-surface-50 dark:bg-surface-800 rounded-base"
            class="text-muted-color px-3 h-10 flex items-center gap-4 !rounded-base overflow-hidden hover:bg-surface-100 hover:dark:bg-surface-700"
          >
            <i class="pi pi-objects-column"></i>
          </RouterLink>

          <RouterLink
            to="/users"
            active-class="bg-surface-50 dark:bg-surface-800 rounded-base"
            class="text-muted-color px-3 h-10 flex items-center gap-4 !rounded-base overflow-hidden hover:bg-surface-100 hover:dark:bg-surface-700"
          >
            <i class="pi pi-user"></i>
          </RouterLink>

          <RouterLink
            to="/countries"
            active-class="bg-surface-50 dark:bg-surface-800 rounded-base"
            class="text-muted-color px-3 h-10 flex items-center gap-4 !rounded-base overflow-hidden hover:bg-surface-100 hover:dark:bg-surface-700"
          >
            <i class="pi pi-map"></i>
          </RouterLink>

          <RouterLink
            to="/publishers"
            active-class="bg-surface-50 dark:bg-surface-800 rounded-base"
            class="text-muted-color px-3 h-10 flex items-center gap-4 !rounded-base overflow-hidden hover:bg-surface-100 hover:dark:bg-surface-700"
          >
            <i class="pi pi-users"></i>
          </RouterLink>

          <RouterLink
            to="/shipping-methods"
            active-class="bg-surface-50 dark:bg-surface-800 rounded-base"
            class="text-muted-color px-3 h-10 flex items-center gap-4 !rounded-base overflow-hidden hover:bg-surface-100 hover:dark:bg-surface-700"
          >
            <i class="pi pi-truck"></i>
          </RouterLink>
        </div>
      </template>
    </Toolbar>
  </div>

  <div class="max-w-80">
    <aside
      :class="[
        store.isExpanded ? 'w-80' : 'w-14',
        'transition-[width] duration-300 ease-in-out hidden justify-between gap-4 xl:h-content px-2 py-4 bg-content-background xl:sticky z-[501] top-4 flex-col rounded-base xl:flex',
      ]"
    >
      <nav class="h-content flex flex-col justify-between">
        <div class="flex flex-col">
          <div class="h-9 flex items-center justify-center">
            <RouterLink
              to="/"
              v-if="store.shouldLabelBeShowed"
              class="items-center justify-center"
            >
              <span class="font-bold text-primary">Story</span>
              <span class="uppercase text-muted-color">Stash</span>
            </RouterLink>

            <RouterLink
              v-if="!store.shouldLabelBeShowed"
              to="/"
              exact-active-class="bg-surface-50 dark:bg-surface-800 rounded-base"
              class="text-muted-color px-3 h-10 flex items-center gap-4 !rounded-base overflow-hidden hover:bg-surface-100 hover:dark:bg-surface-700"
              title="Home"
            >
              <i class="pi pi-home"></i>
            </RouterLink>
          </div>
          <Divider />
          <ul class="flex flex-col">
            <RouterLink
              to="/books"
              activeClass="bg-surface-50 dark:bg-surface-800"
              class="text-muted-color px-3 h-10 flex items-center gap-4 !rounded-base overflow-hidden hover:bg-surface-100 hover:dark:bg-surface-700"
              title="Books"
            >
              <i class="pi pi-book"></i>
              <span v-if="store.isExpanded">Books</span>
            </RouterLink>

            <RouterLink
              to="/categories"
              activeClass="bg-surface-50 dark:bg-surface-800"
              class="text-muted-color px-3 h-10 flex items-center gap-4 !rounded-base overflow-hidden hover:bg-surface-100 hover:dark:bg-surface-700"
              title="Categories"
            >
              <i class="pi pi-objects-column"></i>
              <span v-if="store.isExpanded">Categories</span>
            </RouterLink>

            <RouterLink
              to="/users"
              activeClass="bg-surface-50 dark:bg-surface-800"
              class="text-muted-color px-3 h-10 flex items-center gap-4 !rounded-base overflow-hidden hover:bg-surface-100 hover:dark:bg-surface-700"
              title="Users"
            >
              <i class="pi pi-user"></i>
              <span v-if="store.isExpanded">Users</span>
            </RouterLink>

            <RouterLink
              to="/countries"
              activeClass="bg-surface-50 dark:bg-surface-800"
              class="text-muted-color px-3 h-10 flex items-center gap-4 !rounded-base overflow-hidden hover:bg-surface-100 hover:dark:bg-surface-700"
              title="Countries"
            >
              <i class="pi pi-map"></i>
              <span v-if="store.isExpanded">Countries</span>
            </RouterLink>

            <RouterLink
              to="/publishers"
              activeClass="bg-surface-50 dark:bg-surface-800"
              class="text-muted-color px-3 h-10 flex items-center gap-4 !rounded-base overflow-hidden hover:bg-surface-100 hover:dark:bg-surface-700"
              title="Publishers"
            >
              <i class="pi pi-users"></i>
              <span v-if="store.isExpanded">Publishers</span>
            </RouterLink>

            <RouterLink
              to="/shipping-methods"
              activeClass="bg-surface-50 dark:bg-surface-800"
              class="text-muted-color px-3 h-10 flex items-center gap-4 !rounded-base overflow-hidden hover:bg-surface-100 hover:dark:bg-surface-700"
              title="Shipping methods"
            >
              <i class="pi pi-truck"></i>
              <span v-if="store.isExpanded">Shipping methods</span>
            </RouterLink>
          </ul>
        </div>

        <div class="flex flex-col gap-2">
          <button
            class="text-muted-color px-3 h-10 flex items-center gap-4 !rounded-base overflow-hidden hover:bg-surface-100 hover:dark:bg-surface-700"
            @click="authService.logout"
            title="Log out"
          >
            <i class="pi pi-sign-out"></i>
            <span v-if="store.isExpanded">Log out</span>
          </button>
          <Divider />
          <button
            class="text-muted-color px-3 h-10 flex items-center gap-4 !rounded-base overflow-hidden hover:bg-surface-100 hover:dark:bg-surface-700"
            @click="store.toggleTheme"
            title="Toggle theme"
          >
            <i v-if="store.isDark" class="pi pi-moon"></i>
            <i v-if="!store.isDark" class="pi pi-sun"></i>
            <span v-if="store.isExpanded">
              {{ store.isDark ? 'Dark' : 'Light' }}
            </span>
          </button>
          <button
            class="text-muted-color px-3 h-10 flex items-center gap-4 !rounded-base overflow-hidden hover:bg-surface-100 hover:dark:bg-surface-700"
            @click="store.toggleExpandCollapse"
            title="Collapse/Expand"
          >
            <i v-if="store.isExpanded" class="pi pi-arrow-left"></i>
            <i v-if="!store.isExpanded" class="pi pi-arrow-right"></i>
            <span>Collapse</span>
          </button>
        </div>
      </nav>
    </aside>
  </div>
</template>
