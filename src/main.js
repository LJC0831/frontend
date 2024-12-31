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

