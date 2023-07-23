<template>
  <div>
    <!-- 메뉴 항목들 -->
    <button @click="toggleSidebar">{{ sidebarOpen ? '메뉴열기' : '메뉴닫기' }}</button>
    <div class="sidebar" :class="{ 'open': sidebarOpen }">
        <div class="menu-item"  v-if="!sidebarOpen" @click="handleMenuClick('테스트1')">전체 글 보기</div>
        <div class="menu-item"  v-if="!sidebarOpen" @click="handleMenuClick('테스트2')">문의하기</div>
        <div class="menu-item"  v-if="!sidebarOpen" @click="handleMenuClick('테스트3')">Q&A</div>
    </div>
  </div>
</template>

<script>
export default {
    data() {
        return {
        sidebarOpen: false, // 사이드바의 초기 상태는 열린 상태로 설정
        };
    },
  methods: {
    toggleSidebar() {
      this.sidebarOpen = !this.sidebarOpen; // 상태를 토글하여 사이드바 접기/열기
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
  height: 780px;
  background-color: #f0f0f0;
  padding: 10px;
  flex: 0 0 200px; /* 사이드바 너비 설정 */
  transition: width 0.3s ease; /* 사이드바 접고/열 때 애니메이션 적용 */
}
.open {
  width: 0; /* 사이드바 접을 때 너비를 0으로 설정하여 감추기 */
}

.menu-item {
  cursor: pointer;
  margin-bottom: 10px;
  padding: 10px;
  background-color: #eaeaea;
  border-radius: 5px;
  text-align: center;
  font-weight: bold;
  color: #333;
  transition: background-color 0.3s ease;
}

.menu-item:hover {
  background-color: #d0d0d0;
}
</style>