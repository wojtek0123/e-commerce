import { StrictMode } from 'react';
import { BrowserRouter } from 'react-router-dom';
import * as ReactDOM from 'react-dom/client';
import App from './app/app';
import axios from 'axios';
import { Tokens } from '@e-commerce/shared/api-models';

axios.interceptors.request.use(
  function (config) {
    // const authService = useAuthService();

    // const { access, refresh } = authService.tokens.value;

    config.headers.set('app', 'delivery-manager');

    // config.headers.Authorization = `Bearer ${config.url?.includes('refresh') ? refresh : access}`;

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

      // const authStore = useAuthStore();

      try {
        const { data } = await axios.post<{
          accessToken: Tokens['accessToken'];
          refreshToken: Tokens['refreshToken'];
        }>(`${import.meta.env.VITE_API_URL}/auth/refresh`, {
          // userId: authStore.userId,
          // refreshToken: authStore.tokens.refresh,
        });

        // authStore.setSessionToStorage(data);

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

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement,
);

root.render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
);
