import { useAuthStore } from '@e-commerce/admin-dashboard/auth/data-access';
import { computed } from 'vue';

export function useAuthService() {
  const authStore = useAuthStore();

  const isAuthenticated = computed(() => authStore.isAuthenticated);
  const tokens = computed(() => authStore.tokens);

  function getSessionFromStorage() {
    authStore.getSessionFromStorage();
  }

  function logout() {
    authStore.logout();
  }

  return {
    authStore,
    isAuthenticated,
    getSessionFromStorage,
    logout,
    tokens,
  };
}
