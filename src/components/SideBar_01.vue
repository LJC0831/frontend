<template>
  <div class="sidebar">
    <!-- 메뉴 항목들 -->
    <div class="menu-item" @click="handleMenuClick('테스트1')">전체 글 보기</div>
    <div class="menu-item" @click="handleMenuClick('테스트2')">문의하기</div>
    <div class="menu-item" @click="handleMenuClick('테스트3')">Q&A</div>
  </div>
</template>

<script>
export default {
  methods: {
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