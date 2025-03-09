import { useAuthStore } from '@e-commerce/delivery-manager/auth/data-access';

export function useAuthApi() {
  const {
    userId,
    tokens: { access, refresh },
  } = useAuthStore();

  return {
    isAuthenticated: userId && access && refresh,
  };
}
