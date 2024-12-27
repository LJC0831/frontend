<template>
    <footer class="footer-container">
      <div class="mobile-icons">
          <div class="icon" @click="navigateToPage('')">
            <i class="fas fa-home"></i>
          </div>
          <div class="icon" @click="navigateToPage('chat_main')"> 
            <i class="fas fa-comment"></i>
          </div>
          <div class="icon" @click="navigateToPage('memoVue')">
            <i class="fas fa-question-circle" @click="navigateToPage('profile')"></i>
          </div>
        <!-- Add more icons as needed -->
      </div>
    </footer>
  </template>

<script>
/* eslint-disable */
export default {
  props: ['menuSelected'], // 부모 컴포넌트로부터 menuSelected 프롭을 받음
  methods: {
    navigateToPage(menuName) {
      this.$emit('menuSelected', menuName); // 메뉴 선택 이벤트를 발생시킴
    }
  }
};
</script>
  <style scoped>

.mobile-icons {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-around;
  align-items: center;
  background-color: #ffffff;
  padding: 10px;
  border-top: 1px solid #cccccc;
}
.icon {
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
}

.icon i {
  font-size: 24px;
}

.icon span {
  font-size: 12px;
  margin-top: 2px;
}
@media (max-width: 768px) {
  .mobile-icons {
    height: 40px;
  }
  .icon {
    height: 25px;
  }
}

  </style>