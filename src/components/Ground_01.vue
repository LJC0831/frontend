<template>
  <div class="ground">
    <Header/>
    <div class="main-container">
      <Sidebar v-on:menuSelected="handleMenuSelected" :selectedMenu="selectedMenu" />
      <!--<Memo/>-->
      <div class="content">
        <!-- Memo_01.vue 컴포넌트 보여주기 -->
        <main01 v-if="selectedMenu === ''" /> 
        <Memo_01 v-if="selectedMenu === 'memoVue'" />
        <Intro v-if="selectedMenu === 'introVue'" />
        <Basic_logo v-if="selectedMenu === 'QAVue'" />
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
import Sidebar from "./SideBar_01"; // 사이드바 컴포넌트를 import 합니다.
export default {
  components:{Header, Footer, Sidebar, Basic_logo},
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

.main-container {
  display: flex;
  flex: 1; /* .main-container가 남은 공간을 모두 차지하도록 설정 */
  overflow-x: hidden; /* 사이드바가 열렸을 때 오른쪽 영역이 넘치지 않도록 함 */
}

.sidebar {
  width: 150px;
  height: 100%;
  background-color: #333;
  padding: 10px;
  position: fixed;
  top: 0;
  left: 0;
  transition: transform 0.3s ease;
  transform: translateX(-100%);
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  pointer-events: none;
}

.open {
  transform: translateX(0);
}

.content {
  flex: 1; /* content가 남은 공간을 모두 차지하도록 설정 */
  z-index: -1;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 사이드바 버튼 스타일 */
.sidebar-toggle-container {
  display: flex;
  align-items: center;
  margin-top: -1px;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;
  width: 100%;
  background-color: #333;
}

.sidebar-toggle-btn {
  color: #fff;
  border: none;
  cursor: pointer;
  padding: 10px;
  font-size: 20px;
  transition: background-color 0.3s ease;
  /* Updated styles */
  position: absolute;
  left: 10px;
  top: 71px;
  display: flex;
  align-items: center;
  gap: 5px;
  background-color: transparent;
}


/* 화면 크기가 768px 이하인 경우 버튼들을 세로로 정렬 */
@media (max-width: 768px) {
  .main-container {
    display: flex; /* 사이드바와 컨텐츠 영역을 가로로 배치 */
    margin-right: 0;
  }

  .content {
    /* 컨텐츠 영역의 마진을 조정하여 사이드바가 열릴 때 컨텐츠가 가려지지 않도록 함 */
    margin-left: 0;
    margin-right: 10px;
  }
}

</style>


