import { useAuthStore } from '@e-commerce/admin-dashboard/auth/data-access';
import { computed } from 'vue';

const authStore = useAuthStore();

const isAuthenticated = computed(() => authStore.isAuthenticated);

function getSessionFromStorage() {
  authStore.getSessionFromStorage();
}

function logout() {
  authStore.logout();
}

export const useAuthApi = {
  getSessionFromStorage,
  logout,

  isAuthenticated,
} as const;
