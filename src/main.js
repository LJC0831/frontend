/* eslint-disable */
import { createApp } from 'vue';
import App from './App.vue';
import store from "./store";
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';
import VueToast from 'vue-toast-notification';
import 'vue-toast-notification/dist/theme-sugar.css';
import router from './router/router.js'

import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';

library.add(fas);
const app = createApp(App);
app.use(router); // Vue Router 사용
app.use(store);
app.use(VueToast); // Register the VueToast plugin
app.component('font-awesome-icon', FontAwesomeIcon)


app.mount('#app');

