<template>
  <div class="ground">
    <Header @menuSelected="handleMenuSelected02" />
          <div class="content">
            <router-view v-if="selectedMenu === 'chat_main'" :chatData="chatData"/> 
            <router-view v-else /> 
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
import userList from "./menu/userList.vue";
import chat_main from "./menu/chat_main.vue";
import login from "./menu/login.vue";
export default {
  components:{Header, Footer, main01, Memo_01, chat_main, userList, login},
  data() {
    return {
      selectedMenu: '', // 선택된 메뉴를 저장할 변수 추가
      chatData: null, 
    };
  },
  mounted() {
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