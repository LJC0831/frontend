import { createRouter, createWebHistory } from 'vue-router'
import ChatList from '@/components/menu/chat_main.vue';
import ChatRoom from '@/components/menu/chat_01.vue';
import ChatUser from '@/components/menu/userList.vue';
import ChatLogin from '@/components/menu/login.vue';
import ChatSignup from '@/components/menu/signup.vue';
import ChatMemo from '@/components/Memo_01.vue';
import ChatMain from '@/components/main_01.vue';

const routes = [
      { path: '/', component: ChatMain },
      { path: '/chat', component: ChatList },
      { path: '/chat/:chatId', component: ChatRoom },
      { path: '/auth/kakao/callback', name: 'KakaoCallback', component: ChatLogin },
      { path: '/user', component: ChatUser},
      { path: '/memo', component: ChatMemo},
      { path: '/login', component: ChatLogin},
      { path: '/signup', component: ChatSignup},
    ];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// router.beforeEach((to, from, next) => {
//   if (to.name === 'Regi02' && from.name !== 'ItemDetail') {
//     // 'Home' 경로에서 리디렉션된 경우가 아니면 홈으로 리디렉션
//     next({ name: 'Home' });
//   } 
//   else if ((to.name === 'chat01' && from.name !== 'ItemDetail') && (to.name === 'chat01' && from.name !== 'MyBoard') ) {
//     next({ name: 'Home' });
//   }
//   else {
//     next(); // 허용
//   }
// });

export default router;
