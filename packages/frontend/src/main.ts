import { createApp } from 'vue';
import App from './App.vue';
import { globalLoader } from 'vue-global-loader';
import Toast from 'vue-toastification';
import 'vue-toastification/dist/index.css';

const app = createApp(App);
app.use(globalLoader);
app.use(Toast);
app.mount('#app');
