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
      sidebarOpen: false,
      menus: [
        { name: '테스트1', label: '전체 글 보기' },
        { name: '테스트2', label: '문의하기' },
        { name: '테스트3', label: 'Q&A' },
      ],
    };
  },
  methods: {
    toggleSidebar() {
      this.sidebarOpen = !this.sidebarOpen;
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
}

.sidebar-toggle-btn {
  background-color: #333;
  color: #fff;
  border: none;
  cursor: pointer;
  padding: 10px;
  font-size: 18px;
  border-radius: 0; /* 네모 버튼으로 변경 */
  transition: background-color 0.3s ease;
}

.sidebar-toggle-btn.open {
  background-color: #777; /* 버튼 열릴 때 배경색 변경 */
}

.sidebar-expand {
  flex: 1;
  height: 100%;
  transition: width 0.3s ease;
  background-color: transparent;
}

.sidebar {
  width: 150px;
  height: 74%;
  background-color: #333;
  padding: 10px;
  position: fixed;
  top: 14%;
  left: 0;
  z-index: 999;
  transition: transform 0.3s ease;
  transform: translateX(-100%);
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2); /* 그림자 추가 */
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
}
</style>