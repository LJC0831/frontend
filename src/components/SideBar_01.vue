<template>
  <div>
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
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      sidebarOpen: true,
      menus: [
        { name: '테스트1', label: '소개 글 보기' },
        { name: '테스트2', label: '글 작성' },
        { name: '테스트3', label: 'Q&A' },
      ],
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
      alert(`선택한 메뉴: ${menuName}`);
    },
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
  height: 78.5%;
  background-color: #333;
  padding: 10px;
  position: fixed;
  top: 12%;
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
  pointer-events: auto; /* 사이드바가 열렸을 때 포인터 이벤트를 받도록 설정 */
}
</style>