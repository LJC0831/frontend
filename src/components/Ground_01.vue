<template>
  <div class="ground">
    <Header/>
      <div class="main-container">
        <Sidebar v-on:menuSelected="handleMenuSelected" :selectedMenu="selectedMenu" />
      </div>
        <!--<Memo/>-->
          <!-- Memo_01.vue 컴포넌트 보여주기 -->
          <div class="content">
            <main01 v-if="selectedMenu === ''" /> 
            <Memo_01 v-if="selectedMenu === 'memoVue'" />
            <Intro v-if="selectedMenu === 'introVue'" />
            <maker_01 v-if="selectedMenu === 'maker_01'" />
            <chat_01 v-if="selectedMenu === 'chat_01'" />
          </div>
    <!-- <Footer/> -->
  </div>
</template>

<script>
/* eslint-disable */ 
import Header from "./Header_01.vue";
//import Footer from "./Footer_01.vue";
import Sidebar from "./SideBar_01"; // 사이드바 컴포넌트를 import 합니다.
export default {
  components:{Header, Sidebar},
  //components:{Header, Footer, Sidebar},
  data() {
    return {
      selectedMenu: '', // 선택된 메뉴를 저장할 변수 추가
      sidebarOpen: false, // 사이드바 열림 여부를 저장할 변수 추가
    };
  },
  methods: {
    handleMenuSelected(menuName) {
      this.selectedMenu = menuName; // 선택된 메뉴 이름으로 selectedMenu 데이터를 업데이트합니다
    },
    toggleSidebar() {
      this.sidebarOpen = !this.sidebarOpen;
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


