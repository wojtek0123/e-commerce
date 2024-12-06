<script setup lang="ts">
import { RouterLink } from 'vue-router';
import Toolbar from 'primevue/toolbar';
import Button from 'primevue/button';
import Divider from 'primevue/divider';
import { ref, onMounted } from 'vue';

onMounted(() => {
  const isUserPreferDark = window.matchMedia(
    '(prefers-color-scheme: dark)',
  ).matches;

  const isPreferableThemeDark = JSON.parse(
    localStorage.getItem('isDark') ?? 'null',
  );

  const isDarkTheme =
    isPreferableThemeDark === null ? isUserPreferDark : isPreferableThemeDark;

  setTheme(isDarkTheme ? 'dark' : 'light');

  const isUserPreferExpanded = JSON.parse(
    localStorage.getItem('isExpanded') || 'false',
  ) as boolean;

  isExpanded.value = isUserPreferExpanded;
  shouldLabelBeShowed.value = isUserPreferExpanded;
});

const isExpanded = ref(true);
const shouldLabelBeShowed = ref(true);
const isDark = ref(false);
const timer = ref<number | null>(null);

function toggleExpandCollapse() {
  isExpanded.value = !isExpanded.value;

  if (timer.value) timer.value = null;

  timer.value = setTimeout(
    () => {
      shouldLabelBeShowed.value = isExpanded.value;
    },
    isExpanded.value ? 150 : 0,
  );

  localStorage.setItem('isExpanded', JSON.stringify(isExpanded.value));
}

function setTheme(theme: 'dark' | 'light') {
  isDark.value = theme === 'dark';

  if (theme === 'dark') {
    document.querySelector('html')?.classList.add('dark');
  }

  localStorage.setItem('isDark', JSON.stringify(isDark.value));
}

function toggleTheme() {
  isDark.value = !isDark.value;

  document.querySelector('html')?.classList.toggle('dark');

  localStorage.setItem('isDark', JSON.stringify(isDark.value));
}
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
          <Button
            size="large"
            text
            icon="pi pi-bars"
            class="text-muted-color h-10 !rounded-base overflow-hidden hover:bg-surface-200 hover:dark:bg-surface-600"
          />
          <RouterLink
            to="/books/list"
            active-class="bg-surface-100 dark:bg-surface-700 rounded-base"
            class="text-muted-color px-3 h-10 flex items-center gap-4 !rounded-base overflow-hidden hover:bg-surface-200 hover:dark:bg-surface-600 cursorpointer"
          >
            <i class="pi pi-book"></i>
          </RouterLink>
          <RouterLink
            to="/"
            active-class="bg-surface-100 dark:bg-surface-700 rounded-base"
            class="text-muted-color px-3 h-10 flex items-center gap-4 !rounded-base overflow-hidden hover:bg-surface-200 hover:dark:bg-surface-600 cursorpointer"
          >
            <i class="pi pi-home"></i>
          </RouterLink>

          <RouterLink
            to="/account"
            active-class="bg-surface-100 dark:bg-surface-700 rounded-base"
            class="text-muted-color px-3 h-10 flex items-center gap-4 !rounded-base overflow-hidden hover:bg-surface-200 hover:dark:bg-surface-600 cursorpointer"
          >
            <i class="pi pi-user"></i>
          </RouterLink>
        </div>
      </template>
    </Toolbar>
  </div>

  <div class="max-w-80">
    <aside
      :class="[
        isExpanded ? 'w-80' : 'w-14',
        'transition-[width] transition-all duration-300 ease-in-out hidden justify-between gap-4 xl:h-content px-2 py-4 bg-content-background xl:sticky z-[1001] top-4 flex-col rounded-base xl:flex',
      ]"
    >
      <nav class="h-content flex flex-col justify-between">
        <div class="flex flex-col">
          <div class="h-9 flex items-center justify-center">
            <RouterLink
              to="/"
              v-if="shouldLabelBeShowed"
              class="items-center justify-center"
            >
              <span class="font-bold text-primary">Story</span>
              <span class="uppercase text-muted-color">Stash</span>
            </RouterLink>

            <RouterLink
              v-if="!shouldLabelBeShowed"
              to="/"
              active-class="bg-surface-100 dark:bg-surface-700 rounded-base"
              class="text-muted-color px-3 h-10 flex items-center gap-4 !rounded-base overflow-hidden hover:bg-surface-200 hover:dark:bg-surface-600"
            >
              <i class="pi pi-home"></i>
            </RouterLink>
          </div>
          <Divider />
          <ul class="flex flex-col">
            <RouterLink
              to="/books"
              activeClass="bg-surface-100 dark:bg-surface-700"
              class="text-muted-color px-3 h-10 flex items-center gap-4 !rounded-base overflow-hidden hover:bg-surface-200 hover:dark:bg-surface-600 cursorpointer"
            >
              <i class="pi pi-book"></i>
              <span v-if="isExpanded">Books</span>
            </RouterLink>
          </ul>
        </div>

        <div class="flex flex-col gap-2">
          <Divider />
          <button
            class="text-muted-color px-3 h-10 flex items-center gap-4 !rounded-base overflow-hidden hover:bg-surface-200 hover:dark:bg-surface-600"
            @click="toggleTheme"
          >
            <i v-if="isDark" class="pi pi-moon"></i>
            <i v-if="!isDark" class="pi pi-sun"></i>
            <span v-if="isExpanded">{{ isDark ? 'Dark' : 'Light' }}</span>
          </button>
          <button
            class="text-muted-color px-3 h-10 flex items-center gap-4 !rounded-base overflow-hidden hover:bg-surface-200 hover:dark:bg-surface-600"
            @click="toggleExpandCollapse"
          >
            <i v-if="isExpanded" class="pi pi-arrow-left"></i>
            <i v-if="!isExpanded" class="pi pi-arrow-right"></i>
            <span>Collapse</span>
          </button>
        </div>
      </nav>
    </aside>
  </div>
</template>
