<template>
  <div @touchend="handleTouchEnd">
    <!-- 메뉴 항목들 -->
    <div class="sidebar-toggle-container">
      <button @click="toggleSidebar" class="sidebar-toggle-btn" :class="{ 'open': sidebarOpen }">
        <i :class="sidebarOpen ? 'fas fa-times' : 'fas fa-bars'"></i>
      </button>
    </div>
    <div class="sidebar" :class="{ 'open': sidebarOpen }">
      <div v-for="(menu, index) in menus" :key="index" class="menu-item" @click="handleMenuClick(menu.name)">
        {{ menu.label }}
      </div>
    </div>
    <div class="content" :style="{ marginLeft: sidebarOpen ? '150px' : '10px' }">
      <!-- Memo_01.vue 컴포넌트 보여주기 -->
      <main01 v-if="selectedMenu === ''" />
      <Intro v-if="selectedMenu === 'introVue'" />
      <Memo_01 v-if="selectedMenu === 'memoVue'" />
      <maker_01 v-if="selectedMenu === 'maker_01'" />
      <chat_01 v-if="selectedMenu === 'chat_01'" />
    </div>
  </div>
</template>

<script>
/* eslint-disable */
import Memo_01 from "./Memo_01.vue";
import Intro from "./intro_01.vue";
import main01 from "./main_01.vue";
import maker_01 from "./maker_01.vue";
import chat_01 from "./menu/chat_01.vue";
export default {
  props: ['menuSelected'], // 부모 컴포넌트로부터 menuSelected 프롭을 받음
  mounted() {
    // 터치 이벤트 리스너 등록
    document.addEventListener('touchstart', this.handleTouchStart);
    document.addEventListener('touchmove', this.handleTouchMove);
  },

  beforeDestroy() {
    // 컴포넌트가 파괴되기 전에 리스너 해제
    document.removeEventListener('touchstart', this.handleTouchStart);
    document.removeEventListener('touchmove', this.handleTouchMove);
  },
  data() {
    return {
      sidebarOpen: false,
      menus: [
        { name: '', label: '메인화면' },
        { name: 'introVue', label: '소개 글 보기' },
        { name: 'chat_01', label: '대화하기' },
        { name: 'memoVue', label: '문의하기' },
        { name: 'maker_01', label: '제작자정보' },
      ],
      selectedMenu: '', // 선택된 메뉴를 저장할 변수 추가
      touchStartX: null,
      touchMoveX: null,
    };
  },
  methods: {
    toggleSidebar() {
      this.sidebarOpen = !this.sidebarOpen;
      // 토글 시 사이드바의 z-index 변경
      this.$nextTick(() => {
        const sidebarElement = document.querySelector('.sidebar');
        if (this.sidebarOpen) {
          sidebarElement.style.zIndex = '1000';
          // 사이드바가 열렸을 때 포인터 이벤트를 받을 수 있도록 설정
          sidebarElement.style.pointerEvents = 'auto';
        } else {
          sidebarElement.style.zIndex = '1';
          // 사이드바가 닫혔을 때 포인터 이벤트를 받지 않도록 설정
          sidebarElement.style.pointerEvents = 'none';
        }
      });
    },
    handleMenuClick(menuName) {
      this.selectedMenu = menuName;
      this.$emit('menuSelected', menuName);
    },
    // 터치 시작 이벤트 처리
    handleTouchStart(event) {
      this.touchStartX = event.touches[0].clientX;
      this.touchMoveX = this.touchStartX;
    },

    // 터치 이동 이벤트 처리
    handleTouchMove(event) {
      this.touchMoveX = event.touches[0].clientX;
    },

    // 터치 종료 이벤트 처리 및 사이드바 접힘 처리
    handleTouchEnd(event) {
      if (this.touchStartX !== null && this.touchMoveX !== null) {
        const deltaX = this.touchMoveX - this.touchStartX;
        if (deltaX > 50 && this.sidebarOpen) {
          this.toggleSidebar();
        }
      }
      this.touchStartX = null;
      this.touchMoveX = null;
    },
  },
  components: {
      Memo_01, // Memo_01 컴포넌트 등록
      Intro,
      main01,
      maker_01,
      chat_01,
  },
};
</script>

<style scoped>
.sidebar-toggle-container {
  display: flex;
  align-items: center;
  margin-top: -1px; /* 상단 여백 조정 */
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000; /* 사이드바 토글 버튼이 사이드바 위에 표시되도록 설정 */
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

/* 햄버거 아이콘을 오른쪽으로 이동 */
.sidebar-toggle-btn i {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
}

.sidebar-expand {
  flex: 1;
  height: 100%;
  transition: width 0.3s ease;
  background-color: transparent;
}

.sidebar {
  width: 150px;
  height: 100%;
  background-color: #333;
  padding: 10px;
  position: fixed;
  top: 9.3%;
  left: 0;
  transition: transform 0.3s ease;
  transform: translateX(-100%);
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2); /* 그림자 추가 */
  pointer-events: none; /* 사이드바가 열렸을 때 포인터 이벤트를 받지 않도록 설정 */
}

/* 화면 크기가 768px 이하인 경우 버튼들을 세로로 정렬 */
@media (max-width: 768px) {
  .sidebar {
  width: 150px;
  height: 100%;
  background-color: #333;
  padding: 10px;
  position: fixed;
  top: 100px;
  left: 0;
  transition: transform 0.3s ease;
  transform: translateX(-100%);
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2); /* 그림자 추가 */
  pointer-events: none; /* 사이드바가 열렸을 때 포인터 이벤트를 받지 않도록 설정 */
  }
}

.open {
  transform: translateX(0);
}

.menu-item {
  cursor: pointer;
  margin-bottom: 10px;
  padding: 10px;
  background-color: #555;
  border-radius: 5px;
  text-align: center;
  font-weight: bold;
  color: #fff;
  transition: background-color 0.3s ease;
}

.menu-item:hover {
  background-color: #777;
}

.content {
  transition: margin-left 0.3s ease;
  width: 100%;
  pointer-events: auto; /* 사이드바가 열렸을 때 포인터 이벤트를 받도록 설정 */
}
</style>