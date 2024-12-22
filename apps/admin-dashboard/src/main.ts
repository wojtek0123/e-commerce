import './styles.css';
import PrimeConfig from 'primevue/config';
import Aura from '@primevue/themes/aura';
import { createPinia } from 'pinia';
import ToastService from 'primevue/toastservice';
import ConfirmationService from 'primevue/confirmationservice';
import router from './router';
import axios from 'axios';
import { useAuthStore } from '@e-commerce/admin-dashboard/auth/data-access';

import { createApp } from 'vue';
import App from './app/App.vue';
import { useAuthService } from '@e-commerce/admin-dashboard/auth/api';
import { Tokens } from '@e-commerce/shared/api-models';

const app = createApp(App);
const pinia = createPinia();

app.use(router);
app.use(PrimeConfig, {
  theme: {
    preset: Aura,
    options: {
      darkModeSelector: '.dark',
      cssLayer: {
        name: 'primevue',
        order: 'tailwind-base, primevue, tailwind-utilities',
      },
    },
  },
});
app.use(ToastService);
app.use(ConfirmationService);
app.use(pinia);

axios.interceptors.request.use(
  function (config) {
    const authService = useAuthService();

    const { access, refresh } = authService.tokens.value;

    config.headers.set('app', 'admin-dashboard');

    config.headers.Authorization = `Bearer ${config.url?.includes('refresh') ? refresh : access}`;

    return config;
  },
  function (error) {
    return Promise.reject(error);
  },
);

axios.interceptors.response.use(
  function (response) {
    return response;
  },
  async function (error) {
    const originalConfig = error.config;

    if (
      !originalConfig._retry &&
      !originalConfig.url.includes('login') &&
      error.response?.status === 401
    ) {
      originalConfig._retry = true;

      const authStore = useAuthStore();

      try {
        const { data } = await axios.post<{
          accessToken: Tokens['accessToken'];
          refreshToken: Tokens['refreshToken'];
        }>(`${import.meta.env.VITE_API_URL}/auth/refresh`, {
          userId: authStore.userId,
          refreshToken: authStore.tokens.refresh,
        });

        authStore.setSessionToStorage(data);

        return axios.request({
          ...originalConfig,
          headers: {
            ...originalConfig.headers,
            Authorization: `Bearer ${data.accessToken}`,
          },
        });
      } catch (err) {
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  },
);

app.mount('#root');
