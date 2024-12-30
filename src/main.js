/* eslint-disable */
import { createApp } from 'vue';
import App from './App.vue';
import store from "./store";
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';
import VueToast from 'vue-toast-notification';
import 'vue-toast-notification/dist/theme-sugar.css';
import { createRouter, createWebHistory } from 'vue-router'; // Vue Router 관련 추가

import ChatList from './components/menu/chat_main.vue';
import ChatRoom from './components/menu/chat_01.vue';
import ChatUser from './components/menu/userList.vue';
import ChatLogin from './components/menu/login.vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';

library.add(fas);
const app = createApp(App);

const google_apiKey = process.env.VUE_APP_apiKey; // 환경 변수 읽기
const google_client_secret = process.env.VUE_APP_client_secret; // 환경 변수 읽기
const google_redirect_uri = process.env.VUE_APP_redirect_uri; // 환경 변수 읽기
app.config.globalProperties.$google_apiKey = google_apiKey;
app.config.globalProperties.$google_client_secret = google_client_secret;
app.config.globalProperties.$google_redirect_uri = google_redirect_uri;
app.use(store);
app.use(VueToast); // Register the VueToast plugin
app.component('font-awesome-icon', FontAwesomeIcon)


// Vue Router 설정
const router = createRouter({
    history: createWebHistory(),
    routes: [
      { path: '/chat', component: ChatList },
      { path: '/chat/:chatId', component: ChatRoom },
      { path: '/user', component: ChatUser},
      { path: '/login', component: ChatLogin},
    ]
  });

app.use(router); // Vue Router 사용
app.mount('#app');

