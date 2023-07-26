<template>
  <div>
    <!-- 메뉴 항목들 -->
    <button @click="toggleSidebar" class="sidebar-toggle-btn">
      <i :class="sidebarOpen ? 'fas fa-times' : 'fas fa-bars'"></i>
    </button>
    <div class="sidebar" :class="{ 'open': sidebarOpen }">
      <div v-for="(menu, index) in menus" :key="index" class="menu-item" @click="handleMenuClick(menu.name)">
        {{ menu.label }}
      </div>
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
      // 여기에 선택한 메뉴에 따른 추가 로직을 작성할 수 있습니다.
      // 예를 들어 선택한 메뉴에 따라 API 호출이나 뷰 내용 변경 등을 할 수 있습니다.
    },
  },
};
</script>

<style scoped>
.sidebar {
  width: 200px;
  height: 90%;
  background-color: #333; /* 변경: 더 어두운 배경색 */
  padding: 10px;
  position: fixed;
  top: 14%;
  left: 0;
  z-index: 999;
  transition: transform 0.3s ease;
  transform: translateX(-100%);
}

.open {
  transform: translateX(0);
}

.sidebar-toggle-btn {
  background-color: #444; /* 변경: 더 어두운 토글 버튼 배경색 */
  color: #fff;
  border: none;
  cursor: pointer;
  padding: 10px;
  font-size: 18px;
}

.menu-item {
  cursor: pointer;
  margin-bottom: 10px;
  padding: 10px;
  background-color: #555; /* 변경: 더 어두운 메뉴 배경색 */
  border-radius: 5px;
  text-align: center;
  font-weight: bold;
  color: #fff; /* 변경: 흰색 텍스트 색상 */
  transition: background-color 0.3s ease;
}

.menu-item:hover {
  background-color: #777; /* 변경: 더 밝은 호버 배경색 */
}
</style>