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


const app = createApp(App);
const VUE_APP_apiKey = process.env.VUE_APP_apiKey; // 환경 변수 읽기
const VUE_APP_appId = process.env.VUE_APP_appId; // 환경 변수 읽기
const VUE_APP_authDomain = process.env.VUE_APP_authDomain; // 환경 변수 읽기
const VUE_APP_measurementld = process.env.VUE_APP_measurementld; // 환경 변수 읽기
const VUE_APP_messagingSenderld = process.env.VUE_APP_messagingSenderld; // 환경 변수 읽기
const VUE_APP_projectld = process.env.VUE_APP_projectld; // 환경 변수 읽기
const VUE_APP_storageBucket = process.env.VUE_APP_storageBucket; // 환경 변수 읽기
console.log('API Key:', VUE_APP_apiKey);
console.log('VUE_APP_appId:', VUE_APP_appId);
console.log('VUE_APP_authDomain:', VUE_APP_authDomain);
console.log('VUE_APP_measurementld:', VUE_APP_measurementld);
console.log('VUE_APP_messagingSenderld:', VUE_APP_messagingSenderld);
console.log('VUE_APP_projectld:', VUE_APP_projectld);
console.log('VUE_APP_projectld:', VUE_APP_projectld);
console.log('VUE_APP_storageBucket:', VUE_APP_storageBucket);

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

