<template>
  <div class="ground">
    <Header/>
    <div class="main-container">
      <Sidebar v-on:menuSelected="handleMenuSelected" :selectedMenu="selectedMenu" />
      <!--<Memo/>-->
      <div class="content">
        <!-- Memo_01.vue 컴포넌트 보여주기 -->
        <Memo_01 v-if="selectedMenu === 'memoVue'" />
        <Basic_logo v-if="selectedMenu === ''" />
        <Basic_logo v-if="selectedMenu === 'basicVue'" />
      </div>
        
    </div>
    <Footer/>
  </div>
</template>

<script>
/* eslint-disable */ 
import Header from "./Header_01.vue";
import Footer from "./Footer_01.vue";
import Basic_logo from "./Basic_logo.vue";
import Memo from "./Memo_01.vue";
import Sidebar from "./SideBar_01"; // 사이드바 컴포넌트를 import 합니다.
export default {
  components:{Header, Footer, Sidebar, Basic_logo, Memo},
  data() {
    return {
      selectedMenu: '', // 선택된 메뉴를 저장할 변수 추가
    };
  },
  methods: {
    handleMenuSelected(menuName) {
      this.selectedMenu = menuName; // 선택된 메뉴 이름으로 selectedMenu 데이터를 업데이트합니다
    },
  },
}
</script>

<style>
.ground {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}


.content {
  flex: 1; /* content가 남은 공간을 모두 차지하도록 설정 (Basic_logo가 전체 화면으로 표시됨) */
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: -1;
}

/* 화면 크기가 768px 이하인 경우 버튼들을 세로로 정렬 */
@media (max-width: 768px) {
  .main-container {
  display: flex; /* 사이드바와 메모 컴포넌트를 가로로 배치 */
  }
}

</style>


