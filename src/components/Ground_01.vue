<template>
  <div class="ground">
    <Header @menuSelected="handleMenuSelected02"/>
      <div class="main-container">
        <!-- <Sidebar v-on:menuSelected="handleMenuSelected" :selectedMenu="selectedMenu" /> -->
      </div>
          <!-- Memo_01.vue 컴포넌트 보여주기 -->
          <div class="content">
            <main01 v-if="selectedMenu === ''" /> 
            <Memo_01 v-if="selectedMenu === 'memoVue'" />
            <userList v-if="selectedMenu === 'userList'" />
            <maker_01 v-if="selectedMenu === 'maker_01'" />
            <chat_main v-if="selectedMenu === 'chat_main'" :chatData="chatData"/>
          </div>
    <div class="ad-container"></div>
    <Footer @menuSelected="handleMenuSelected" />
  </div>
</template>

<script>
/* eslint-disable */ 
import Header from "./Header_01.vue";
import Footer from "./Footer_01.vue";
import main01 from "./main_01.vue";
import Memo_01 from "./Memo_01.vue";
import socialChat from "./menu/socialChat.vue";
import userList from "./menu/userList.vue";
import maker_01 from "./maker_01.vue";
import chat_main from "./menu/chat_main.vue";
import { loadAds2 } from '../scripts/ads.js'
// import Sidebar from "./SideBar_01"; // 사이드바 컴포넌트를 import 합니다.
export default {
  //components:{Header, Sidebar},
  components:{Header, Footer, main01, Memo_01, chat_main, socialChat, maker_01, userList},
  data() {
    return {
      selectedMenu: '', // 선택된 메뉴를 저장할 변수 추가
      chatData: null, 
      //sidebarOpen: false, // 사이드바 열림 여부를 저장할 변수 추가
    };
  },
  mounted() {
    //loadAds2(); // 광고를 로드하는 함수 호출
  },
  methods: {
    handleMenuSelected(menuName) {
      this.selectedMenu = menuName; // 선택된 메뉴 이름으로 selectedMenu 데이터를 업데이트합니다
      this.chatData = null;
    },
    handleMenuSelected02(menuName) {
      const parts = menuName.split("/");
      this.chatData = parts[1];
      this.selectedMenu = parts[0]; // 선택된 메뉴 이름으로 selectedMenu 데이터를 업데이트합니다
    },
    // toggleSidebar() {
    //   this.sidebarOpen = !this.sidebarOpen;
    // },
  },
}
</script>

<style scoped>
.ground {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}


</style>