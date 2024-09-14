import "./assets/css/app.css";
import "./assets/css/inputs.css";
import "./assets/css/_global.css";

import App from './App.vue'
import router from './router'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import 'vue-toast-notification/dist/theme-default.css';
import 'primevue/resources/themes/lara-light-green/theme.css'

import Button from "primevue/button"
import Dialog from 'primevue/dialog';
import PrimeVue from 'primevue/config';
import ToastPlugin from 'vue-toast-notification';
import ConfirmDialog from 'primevue/confirmdialog';
import ToastService from 'primevue/toastservice';
import DialogService from 'primevue/dialogservice'
import ConfirmationService from 'primevue/confirmationservice';
import Password from 'primevue/password';
import InputText from 'primevue/inputtext';

import InputGroup from 'primevue/inputgroup';
import InputGroupAddon from 'primevue/inputgroupaddon';

const app = createApp(App)

app.use(createPinia())
app.use(router)


app.use(PrimeVue);
app.use(ToastPlugin);
app.use(ToastService);
app.use(DialogService);
app.use(ToastService);
app.use(ConfirmationService);
app.use(ConfirmationService);
app.component('Button', Button);
app.component('Dialog', Dialog);
app.component("InputGroup",InputGroup);
app.component("InputGroupAddon",InputGroupAddon);
app.component("Password", Password);
app.component("InputText", InputText);

app.component('ConfirmDialog', ConfirmDialog);

app.mount('#app')
