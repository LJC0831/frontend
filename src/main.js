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


const app = createApp(App);
const apiKey = process.env.VUE_APP_apiKey; // 환경 변수 읽기
console.log('API Key:', apiKey);
app.use(store);
app.use(VueToast); // Register the VueToast plugin

// Vue Router 설정
const router = createRouter({
    history: createWebHistory(),
    routes: [
      { path: '/chat', component: ChatList },
      { path: '/chat/:chatId', component: ChatRoom }
    ]
  });

app.use(router); // Vue Router 사용
app.mount('#app');

