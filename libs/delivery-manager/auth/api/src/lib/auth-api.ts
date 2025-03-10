import { useAuthStore } from '@e-commerce/delivery-manager/auth/data-access';

export function useAuthApi() {
  const {
    logout,
    saveSessionToStorage,
    retrieveSession,
    userId,
    tokens: { access, refresh },
  } = useAuthStore();

  return {
    accessToken: access,
    refreshToken: refresh,
    userId,
    isAuthenticated: userId && access && refresh,
    logout,
    saveSessionToStorage,
    retrieveSession,
  };
}
