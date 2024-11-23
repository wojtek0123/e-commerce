import './styles.css';
import PrimeConfig from 'primevue/config';
import Aura from '@primevue/themes/aura';
import { createPinia } from 'pinia';
// import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';

import router from './router';

import { createApp } from 'vue';
import App from './app/App.vue';

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
app.use(pinia);

app.mount('#root');
