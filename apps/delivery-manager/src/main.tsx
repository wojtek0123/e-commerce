import { StrictMode } from 'react';
import { BrowserRouter } from 'react-router-dom';
import * as ReactDOM from 'react-dom/client';
import App from './app/app';
import axios from 'axios';
import { Tokens } from '@e-commerce/shared/api-models';

axios.interceptors.request.use(
  function (config) {
    const accessToken = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');

    config.headers.set('app', 'delivery-manager');

    config.headers.Authorization = `Bearer ${config.url?.includes('refresh') ? refreshToken : accessToken}`;

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
    console.log(error);
    const originalConfig = error.config;

    console.log(originalConfig);

    if (
      !originalConfig._retry &&
      !originalConfig.url.includes('login') &&
      error.response?.status === 401
    ) {
      originalConfig._retry = true;

      const refreshToken = localStorage.getItem('refreshToken');
      const userId = localStorage.getItem('userId');

      // const { userId, refreshToken, saveSessionToStorage } = useAuthApi();

      try {
        const { data } = await axios.post<{
          accessToken: Tokens['accessToken'];
          refreshToken: Tokens['refreshToken'];
        }>(`${import.meta.env.VITE_API_URL}/auth/refresh`, {
          userId,
          refreshToken: refreshToken,
        });

        // saveSessionToStorage(data);

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
