<template>
    <footer class="footer-container">
      <div class="mobile-icons">
          <div class="icon" @click="navigateToPage('')">
            <router-link to="/" class="router-link"><i class="fas fa-home"></i></router-link>
          </div>
          <div class="icon" @click="navigateToPage('chat_main')"> 
            <router-link to="/chat" class="router-link"><i class="fas fa-comment"></i></router-link>
          </div>
          <div class="icon" @click="navigateToPage('memoVue')">
            <router-link to="/memo" class="router-link"><i class="fas fa-question-circle" @click="navigateToPage('profile')"></i></router-link>
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
.router-link {
  color: inherit; 
  text-decoration: none; 
}
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
  
}

  </style>